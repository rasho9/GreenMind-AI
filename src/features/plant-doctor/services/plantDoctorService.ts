import { aiClient } from '@/services/ai';
import { clientRateLimiter } from '@/services/security';
import { ProviderError } from '@/services/utils';
import type { PlantDoctorAnalysis } from '../types';
import type {
  PlantVisionClient,
  PlantVisionInput,
} from './integrationContracts';

const MAX_ENCODED_IMAGE_BYTES = 2_900_000;

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () =>
      reject(new Error('The selected image could not be read.'));
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('The selected image could not be prepared.'));
        return;
      }
      if (new Blob([reader.result]).size > MAX_ENCODED_IMAGE_BYTES) {
        reject(
          new Error(
            'This image is still too large for secure analysis. Choose a smaller or more tightly cropped photo.',
          ),
        );
        return;
      }
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function parseAnalysis(output: string): PlantDoctorAnalysis {
  let value: unknown;
  try {
    value = JSON.parse(output) as unknown;
  } catch {
    throw new ProviderError(
      'GreenMind AI returned an unreadable health report. Please try again.',
      'INVALID_RESPONSE',
    );
  }
  if (
    !value ||
    typeof value !== 'object' ||
    !('plantName' in value) ||
    !('diseaseName' in value) ||
    !('workflow' in value) ||
    !('timeline' in value)
  ) {
    throw new ProviderError(
      'GreenMind AI returned an incomplete health report. Please try again.',
      'INVALID_RESPONSE',
    );
  }
  return value as PlantDoctorAnalysis;
}

/** Sends the validated plant image to the secure GreenMind AI route for live vision analysis. */
export const plantDoctorService: PlantVisionClient = {
  async analyze(input: PlantVisionInput) {
    clientRateLimiter.consume('plant-doctor', 6, 60_000);
    const dataUrl = await fileToDataUrl(input.image);
    const output = await aiClient.complete({
      task: 'plant-doctor',
      input: `Analyze this plant image as a cautious gardening health screening. Return a structured report only. Weather context: ${JSON.stringify(input.weatherContext ?? null)}. Locale: ${input.locale ?? 'not provided'}.`,
      images: [{ dataUrl }],
    });
    return parseAnalysis(output);
  },
};
