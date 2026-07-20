const allowedTypes = new Map([
  ['image/jpeg', [0xff, 0xd8, 0xff]],
  ['image/png', [0x89, 0x50, 0x4e, 0x47]],
  ['image/webp', [0x52, 0x49, 0x46, 0x46]],
]);
const allowedExtensions = new Set(['jpg', 'jpeg', 'png', 'webp']);
const configuredMaxSize = Number(
  import.meta.env.VITE_MAX_PLANT_IMAGE_UPLOAD_MB ?? 8,
);
const maxImageSizeMb = Number.isFinite(configuredMaxSize)
  ? Math.min(Math.max(configuredMaxSize, 1), 20)
  : 8;
export const MAX_PLANT_IMAGE_BYTES = maxImageSizeMb * 1024 * 1024;

export class UploadSecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadSecurityError';
  }
}

async function matchesFileSignature(file: File) {
  const expected = allowedTypes.get(file.type);
  if (!expected) return false;
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  return expected.every((value, index) => bytes[index] === value);
}

export async function validatePlantImage(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (
    !extension ||
    !allowedExtensions.has(extension) ||
    !allowedTypes.has(file.type)
  ) {
    throw new UploadSecurityError('Choose a JPG, PNG, or WEBP image.');
  }
  if (!file.size || file.size > MAX_PLANT_IMAGE_BYTES) {
    throw new UploadSecurityError(
      `Images must be smaller than ${maxImageSizeMb} MB.`,
    );
  }
  if (!(await matchesFileSignature(file))) {
    throw new UploadSecurityError(
      'This file does not match a safe image signature.',
    );
  }
}

/** Compresses client previews before any future upload. Server validation remains mandatory. */
export async function preparePlantImage(file: File): Promise<File> {
  await validatePlantImage(file);
  const image = await createImageBitmap(file);
  const maxDimension = 1_920;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d')?.drawImage(image, 0, 0, width, height);
  image.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', 0.86),
  );
  if (!blob)
    throw new UploadSecurityError('The image could not be prepared safely.');
  const stem = file.name
    .replace(/\.[^.]+$/u, '')
    .replace(/[^a-z0-9-_]/giu, '-');
  return new File([blob], `${stem || 'plant-photo'}.webp`, {
    type: 'image/webp',
    lastModified: Date.now(),
  });
}
