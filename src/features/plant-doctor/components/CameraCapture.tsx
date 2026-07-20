import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Camera, CameraOff, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui';

type CameraCaptureProps = {
  onCapture: (file: File) => void;
  onClose: () => void;
};

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(
        'Camera capture is not available in this browser. Upload an image instead.',
      );
      return;
    }
    setIsStarting(true);
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsReady(true);
      }
    } catch {
      setError(
        'Camera permission was not granted. You can still upload a photo.',
      );
    } finally {
      setIsStarting(false);
    }
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video?.videoWidth || !video.videoHeight) {
      setError('The camera is still preparing. Please try again in a moment.');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas
      .getContext('2d')
      ?.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        onCapture(
          new File([blob], `plant-capture-${Date.now()}.jpg`, {
            type: 'image/jpeg',
          }),
        );
        stopCamera();
        onClose();
      },
      'image/jpeg',
      0.9,
    );
  };

  useEffect(() => () => stopCamera(), []);

  return (
    <div>
      <p className="-mt-2 text-sm leading-6 text-muted">
        Capture a crisp, well-lit view of the affected area. Your browser will
        ask for permission before the camera starts.
      </p>
      <div className="relative mt-5 overflow-hidden rounded-2xl bg-[#163827]">
        <video
          ref={videoRef}
          playsInline
          className={`aspect-[4/3] w-full object-cover ${isReady ? 'block' : 'hidden'}`}
        />
        {!isReady && (
          <div className="grid aspect-[4/3] place-items-center p-6 text-center text-white/70">
            <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-[#a9dfb9]">
              {isStarting ? (
                <LoaderCircle size={21} className="animate-spin" />
              ) : (
                <Camera size={21} />
              )}
            </span>
            <p className="mt-3 text-xs font-semibold">
              {isStarting ? 'Preparing your camera...' : 'Camera is off'}
            </p>
          </div>
        )}
      </div>
      {error && (
        <p
          role="alert"
          className="mt-3 flex gap-2 text-xs leading-5 text-[#bd5548]"
        >
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            stopCamera();
            onClose();
          }}
          leftIcon={<CameraOff size={15} />}
        >
          Cancel
        </Button>
        {isReady ? (
          <Button
            type="button"
            onClick={capture}
            leftIcon={<Camera size={15} />}
          >
            Capture photo
          </Button>
        ) : (
          <Button
            type="button"
            disabled={isStarting}
            onClick={() => void startCamera()}
            leftIcon={<Camera size={15} />}
          >
            {isStarting ? 'Starting camera' : 'Start camera'}
          </Button>
        )}
      </div>
    </div>
  );
}
