import { RefreshCcw, Upload, X } from 'lucide-react';
import { type ChangeEvent, type KeyboardEvent, type MouseEvent, useCallback, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import type { UploadedImage } from '../../types';
import { FullscreenImageModal } from '../ui/FullscreenImageModal';

interface UploadBoxProps {
  id: string;
  label: string;
  subLabel: string;
  image: UploadedImage | null;
  onImageSelect: (image: UploadedImage) => void;
  onClear: () => void;
  accept?: string;
}

export function UploadBox({
  id,
  label,
  subLabel,
  image,
  onImageSelect,
  onClear,
  accept = "image/*"
}: UploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const extractImageDimensions = useCallback((dataUrl: string) => {

    return new Promise<{ width: number; height: number }>((resolve, reject) => {
      const imageElement = new Image();

      imageElement.onload = () => {
        resolve({ width: imageElement.naturalWidth, height: imageElement.naturalHeight });
      };

      imageElement.onerror = () => reject(new Error('Could not read image dimensions.'));
      imageElement.src = dataUrl;
    });
  }, []);



  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) return;

      setShowPreviewModal(false);

      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Result = reader.result as string | null;

        if (!base64Result) return;

        const previewUrl = URL.createObjectURL(file);

        try {
          const dimensions = await extractImageDimensions(base64Result);

          onImageSelect({
            file,
            previewUrl,
            base64: base64Result,
            width: dimensions.width,
            height: dimensions.height
          });

        } catch (error) {
          console.error('Dimension extraction failed', error);

          onImageSelect({
            file,
            previewUrl,
            base64: base64Result,
            width: 0,
            height: 0
          });
        }
      };
      reader.readAsDataURL(file);
    },
    [extractImageDimensions, onImageSelect]
  );

  const triggerClick = () => fileInputRef.current?.click();
  const handleKeyDown = (e: KeyboardEvent) => {

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();

      if (!image) {
        triggerClick();
      } else {
        setShowPreviewModal(true);
      }
    }
  };

  const handleClear = (e: MouseEvent | KeyboardEvent) => {
    e.stopPropagation();
    onClear();
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowPreviewModal(false);
  };

  return (
    <div className="group flex h-full w-full flex-col gap-3">
      <div className="flex shrink-0 items-center justify-between">
        <h3 className="flex items-center gap-2 text-xs font-medium text-slate-200">
          {label}
          {image && (
            <span className="animate-fade-in rounded bg-emerald-500/20 px-1.5 py-0.5 text-xs text-emerald-400">
              Pronto
            </span>
          )}
        </h3>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label={image ? `Visualizar imagem de ${label}` : `Carregar imagem para ${label}`}
        className={cn(
          "relative flex flex-1 min-h-80 w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
          image
            ? "border-slate-700 bg-slate-900"
            : "cursor-pointer border-slate-700 bg-slate-900/50 hover:border-indigo-500/50 hover:bg-slate-800/50"
        )}
        onClick={image ? () => setShowPreviewModal(true) : triggerClick}
        onKeyDown={handleKeyDown}
      >
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
          tabIndex={-1}
        />

        {image ? (
          <>
            <div className="absolute inset-0 size-full">
              <img
                src={image.previewUrl}
                alt={`Preview de ${label}`}
                className="size-full object-cover opacity-90 transition-all duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>

            <div className="absolute right-4 top-4 z-10 flex gap-2 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
              <button
                onClick={(e) => { e.stopPropagation(); triggerClick(); }}
                className="rounded-full bg-slate-900/80 p-2 text-white shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:bg-indigo-600 focus-visible:ring-2 focus-visible:ring-white active:scale-95 cursor-pointer"
                title="Trocar imagem"
                aria-label="Trocar imagem"
              >
                <RefreshCcw size={16} />
              </button>
              <button
                onClick={handleClear}
                className="rounded-full bg-slate-900/80 p-2 text-white shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:bg-red-500 focus-visible:ring-2 focus-visible:ring-white active:scale-95 cursor-pointer"
                title="Remover imagem"
                aria-label="Remover imagem"
              >
                <X size={16} />
              </button>
            </div>

            <div className="absolute bottom-3 left-3 max-w-[90%] truncate rounded-md border border-white/10 bg-slate-950/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {image.file.name}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 p-4 text-center">
            <div className="rounded-full bg-slate-800 p-3 text-slate-400 transition-colors group-hover:bg-indigo-500/10 group-hover:text-indigo-400">
              <Upload size={24} aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-300">Clique para enviar</p>
              <p className="text-xs text-slate-500">{subLabel}</p>
            </div>
          </div>
        )}
      </div>

      <FullscreenImageModal
        isOpen={Boolean(showPreviewModal && image)}
        onClose={() => setShowPreviewModal(false)}
        imageSrc={image?.previewUrl ?? ''}
        alt={image?.file.name}
      />
    </div>
  );
}