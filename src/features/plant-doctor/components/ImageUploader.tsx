import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  Camera,
  Crop,
  ImagePlus,
  RefreshCw,
  RotateCw,
  ZoomIn,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, Card } from '@/components/ui';

type ImageUploaderProps = {
  file?: File;
  previewUrl?: string;
  onFileSelect: (file: File) => void | Promise<void>;
  onRemove: () => void;
  onCapture: () => void;
};

export function ImageUploader({
  file,
  previewUrl,
  onFileSelect,
  onRemove,
  onCapture,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [notice, setNotice] = useState('');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isCropped, setIsCropped] = useState(false);

  const selectFile = useCallback(
    async (nextFile?: File, source = 'selected') => {
      if (!nextFile) return;
      if (!nextFile.type.startsWith('image/')) {
        setNotice(
          'Choose a JPG, PNG, or WEBP image to start a health screening.',
        );
        return;
      }
      setZoom(1);
      setRotation(0);
      setIsCropped(false);
      setNotice(
        source === 'pasted'
          ? 'Image pasted from your clipboard and ready to analyze.'
          : 'Image ready for a Plant Doctor screening.',
      );
      try {
        await onFileSelect(nextFile);
      } catch (error) {
        setNotice(
          error instanceof Error
            ? error.message
            : 'The image could not be prepared safely.',
        );
      }
    },
    [onFileSelect],
  );

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const pastedImage = Array.from(event.clipboardData?.files ?? []).find(
        (item) => item.type.startsWith('image/'),
      );
      if (pastedImage) {
        event.preventDefault();
        setZoom(1);
        setRotation(0);
        setIsCropped(false);
        setNotice('Image pasted from your clipboard and ready to analyze.');
        void selectFile(pastedImage, 'pasted');
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [selectFile]);

  const resetPhoto = () => {
    setZoom(1);
    setRotation(0);
    setIsCropped(false);
    setNotice('');
    onRemove();
  };

  return (
    <Card className="overflow-hidden border-[#cee5d5] p-0 shadow-[0_16px_38px_rgb(23_77_43_/_0.07)]">
      <div className="flex items-start justify-between gap-4 border-b border-line bg-[linear-gradient(120deg,rgb(var(--surface)),rgb(var(--brand-soft)/.38))] px-5 py-5 sm:px-6">
        <div>
          <p className="text-[15px] font-bold text-ink">Plant image intake</p>
          <p className="mt-1 text-sm text-muted">
            Give GreenMind a clear view of the area that needs attention.
          </p>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-[15px] bg-brand text-white shadow-[0_8px_18px_rgb(34_121_81_/_0.18)]">
          <ImagePlus size={20} />
        </span>
      </div>
      <div className="p-5 sm:p-6">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          aria-label="Browse plant image files"
          onChange={(event) => selectFile(event.target.files?.[0])}
        />
        {previewUrl ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            className="overflow-hidden rounded-[20px] border border-line bg-canvas"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(135deg,#e9f6ed,#d6ebdb)]">
              <motion.img
                src={previewUrl}
                alt={`Preview of ${file?.name ?? 'selected plant'}`}
                animate={{ scale: zoom, rotate: rotation }}
                transition={{ type: 'spring', stiffness: 250, damping: 24 }}
                className={`size-full object-cover ${isCropped ? '[clip-path:inset(9%_11%_9%_11%)]' : ''}`}
              />
              {isCropped && (
                <div className="pointer-events-none absolute inset-[9%_11%] border-2 border-white shadow-[0_0_0_999px_rgb(20_50_34_/_0.22)]" />
              )}
              <span className="absolute left-3 top-3 rounded-lg bg-[#173d2a]/82 px-2.5 py-1.5 text-[13px] font-bold text-white backdrop-blur">
                Ready to analyze
              </span>
              <span className="absolute bottom-3 left-3 rounded-lg bg-white/82 px-2.5 py-1.5 text-[13px] font-bold text-brand-dark shadow-sm backdrop-blur">
                {isCropped
                  ? 'Crop frame applied'
                  : `${Math.round(zoom * 100)}% view`}
              </span>
            </div>
            <div className="flex flex-col gap-3 border-t border-line p-3.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-w-0 truncate text-sm font-bold text-ink">
                {file?.name ?? 'Captured plant photo'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <PreviewTool
                  label="Zoom image"
                  onClick={() =>
                    setZoom((value) => Math.min(value + 0.15, 1.6))
                  }
                >
                  <ZoomIn size={16} />
                </PreviewTool>
                <PreviewTool
                  label="Rotate image"
                  onClick={() => setRotation((value) => value + 90)}
                >
                  <RotateCw size={16} />
                </PreviewTool>
                <PreviewTool
                  label="Apply crop frame"
                  active={isCropped}
                  onClick={() => setIsCropped((value) => !value)}
                >
                  <Crop size={16} />
                </PreviewTool>
                <PreviewTool
                  label="Replace image"
                  onClick={() => inputRef.current?.click()}
                >
                  <RefreshCw size={16} />
                </PreviewTool>
                <PreviewTool
                  label="Remove image"
                  destructive
                  onClick={resetPhoto}
                >
                  <Trash2 size={16} />
                </PreviewTool>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                inputRef.current?.click();
              }
            }}
            onClick={() => inputRef.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              void selectFile(event.dataTransfer.files?.[0], 'dropped');
            }}
            animate={{ scale: isDragging ? 1.01 : 1 }}
            className={`focus-ring group grid min-h-[270px] cursor-pointer place-items-center rounded-[20px] border border-dashed p-5 text-center transition-all ${isDragging ? 'border-brand bg-brand-soft/65 shadow-[0_0_0_4px_rgb(34_121_81_/_0.1)]' : 'border-brand/30 bg-[linear-gradient(145deg,rgb(var(--canvas)),rgb(var(--brand-soft)/.38))] hover:border-brand hover:bg-brand-soft/50'}`}
            aria-label="Upload, drop, or paste a plant image"
          >
            <div>
              <motion.span
                animate={{ y: isDragging ? -5 : 0 }}
                className="mx-auto grid size-14 place-items-center rounded-[19px] bg-surface text-brand shadow-card"
              >
                <UploadCloud size={26} />
              </motion.span>
              <p className="mt-4 text-lg font-extrabold">
                Drop a plant photo here
              </p>
              <p className="mt-2 text-sm text-muted">
                Drag and drop, browse files, or paste an image with Ctrl + V.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <span className="rounded-lg border border-line bg-surface px-3 py-2 text-[13px] font-bold text-brand-dark">
                  Drag & Drop
                </span>
                <span className="rounded-lg border border-line bg-surface px-3 py-2 text-[13px] font-bold text-brand-dark">
                  Browse Files
                </span>
                <span className="rounded-lg border border-line bg-surface px-3 py-2 text-[13px] font-bold text-brand-dark">
                  Paste Image
                </span>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="mt-5"
                onClick={(event) => {
                  event.stopPropagation();
                  inputRef.current?.click();
                }}
                leftIcon={<UploadCloud size={17} />}
              >
                Browse Files
              </Button>
            </div>
          </motion.div>
        )}
        <AnimatePresence>
          {notice && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              className="mt-3 rounded-xl border border-brand/15 bg-brand-soft/38 px-3.5 py-2.5 text-sm text-brand-dark"
            >
              {notice}
            </motion.p>
          )}
        </AnimatePresence>
        <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Best for leaf, flower, fruit, stem, root, whole plant, or garden
            area.
          </p>
          <Button
            type="button"
            variant="secondary"
            onClick={onCapture}
            leftIcon={<Camera size={17} />}
          >
            Capture using Camera
          </Button>
        </div>
      </div>
    </Card>
  );
}

function PreviewTool({
  children,
  label,
  onClick,
  active,
  destructive,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`focus-ring grid size-10 place-items-center rounded-xl border transition-colors ${active ? 'border-brand bg-brand text-white' : destructive ? 'border-transparent text-[#b85649] hover:bg-[#fff3f0]' : 'border-line bg-surface text-muted hover:border-brand/30 hover:bg-brand-soft hover:text-brand-dark'}`}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}
