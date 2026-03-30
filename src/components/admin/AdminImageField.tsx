import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Upload, ZoomIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

type AdminImageFieldProps = {
  label: string;
  image: string;
  aspectRatio?: number;
  onUpload: (file: File) => Promise<string>;
  onChange: (value: string) => void;
  previewHeightClassName?: string;
  preserveOriginalRatio?: boolean;
};

const OUTPUT_WIDTH = 1600;

const loadImageElement = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image."));
    image.src = src;
  });

const createEditedImageFile = async (
  sourceUrl: string,
  fileName: string,
  aspectRatio: number,
  zoom: number,
  offsetX: number,
  offsetY: number,
) => {
  const image = await loadImageElement(sourceUrl);
  const outputWidth = OUTPUT_WIDTH;
  const outputHeight = Math.round(OUTPUT_WIDTH / aspectRatio);

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Failed to prepare image editor.");
  }

  const imageRatio = image.naturalWidth / image.naturalHeight;
  const baseWidth = imageRatio > aspectRatio ? outputHeight * imageRatio : outputWidth;
  const baseHeight = imageRatio > aspectRatio ? outputHeight : outputWidth / imageRatio;
  const drawWidth = baseWidth * zoom;
  const drawHeight = baseHeight * zoom;
  const maxOffsetX = Math.max(0, (drawWidth - outputWidth) / 2);
  const maxOffsetY = Math.max(0, (drawHeight - outputHeight) / 2);
  const drawX = (outputWidth - drawWidth) / 2 + (offsetX / 100) * maxOffsetX;
  const drawY = (outputHeight - drawHeight) / 2 + (offsetY / 100) * maxOffsetY;

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, outputWidth, outputHeight);
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) {
        resolve(result);
        return;
      }

      reject(new Error("Failed to export the adjusted image."));
    }, "image/jpeg", 0.92);
  });

  const safeName = fileName.replace(/\.[^/.]+$/, "") || "clinic-image";
  return new File([blob], `${safeName}-edited.jpg`, { type: "image/jpeg" });
};

const AdminImageField = ({
  label,
  image,
  aspectRatio,
  onUpload,
  onChange,
  previewHeightClassName = "h-40",
  preserveOriginalRatio = false,
}: AdminImageFieldProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draftSourceUrl, setDraftSourceUrl] = useState("");
  const [draftFileName, setDraftFileName] = useState("clinic-image.jpg");
  const [isUploading, setIsUploading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [imageRatio, setImageRatio] = useState<number | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(Boolean(image));

  useEffect(() => {
    setIsPreviewLoading(Boolean(image));
  }, [image]);

  useEffect(() => {
    if (!draftSourceUrl) {
      setImageRatio(null);
      return;
    }

    let active = true;

    void loadImageElement(draftSourceUrl)
      .then((loadedImage) => {
        if (active) {
          setImageRatio(loadedImage.naturalWidth / loadedImage.naturalHeight);
        }
      })
      .catch(() => {
        if (active) {
          setImageRatio(null);
        }
      });

    return () => {
      active = false;
    };
  }, [draftSourceUrl]);

  const previewMetrics = useMemo(() => {
    if (!imageRatio) {
      return null;
    }

    const baseWidth = imageRatio > aspectRatio ? (imageRatio / aspectRatio) * 100 : 100;
    const baseHeight = imageRatio > aspectRatio ? 100 : (aspectRatio / imageRatio) * 100;
    const drawWidth = baseWidth * zoom;
    const drawHeight = baseHeight * zoom;
    const left = (100 - drawWidth) / 2 + (offsetX / 100) * Math.max(0, (drawWidth - 100) / 2);
    const top = (100 - drawHeight) / 2 + (offsetY / 100) * Math.max(0, (drawHeight - 100) / 2);

    return {
      width: `${drawWidth}%`,
      height: `${drawHeight}%`,
      left: `${left}%`,
      top: `${top}%`,
    };
  }, [aspectRatio, imageRatio, offsetX, offsetY, zoom]);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (preserveOriginalRatio) {
      setIsUploading(true);
      void onUpload(file)
        .then((uploadedUrl) => {
          onChange(uploadedUrl);
        })
        .finally(() => {
          setIsUploading(false);
        });
      event.target.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setDraftSourceUrl((previous) => {
      if (previous.startsWith("blob:")) {
        URL.revokeObjectURL(previous);
      }
      return objectUrl;
    });
    setDraftFileName(file.name);
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    setIsDialogOpen(true);
    event.target.value = "";
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setDraftSourceUrl((previous) => {
        if (previous.startsWith("blob:")) {
          URL.revokeObjectURL(previous);
        }
        return "";
      });
      setDraftFileName("clinic-image.jpg");
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
    }
  };

  const handleApply = async () => {
    if (!draftSourceUrl || !aspectRatio) {
      return;
    }

    setIsUploading(true);
    try {
      const adjustedFile = await createEditedImageFile(
        draftSourceUrl,
        draftFileName,
        aspectRatio,
        zoom,
        offsetX,
        offsetY,
      );
      const uploadedUrl = await onUpload(adjustedFile);
      onChange(uploadedUrl);
      handleDialogOpenChange(false);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="space-y-3 rounded-[24px] border border-border bg-background/80 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">
              {preserveOriginalRatio
                ? "Original image ratio is preserved here and on the website."
                : "Preview only. Use upload to replace and adjust the image."}
            </p>
          </div>
          <button
            type="button"
            onClick={openPicker}
            disabled={isUploading}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {isUploading ? "Uploading..." : "Replace Image"}
          </button>
        </div>

        <div
          className={`relative overflow-hidden rounded-[20px] border border-border bg-secondary/40 ${
            preserveOriginalRatio ? "p-3" : previewHeightClassName
          }`}
        >
          {image ? (
            <div className={preserveOriginalRatio ? "flex justify-center" : "h-full w-full"}>
              <img
                src={image}
                alt={label}
                onLoad={() => setIsPreviewLoading(false)}
                onError={() => setIsPreviewLoading(false)}
                className={
                  preserveOriginalRatio
                    ? "h-auto max-h-[520px] w-full rounded-[16px] object-contain"
                    : "h-full w-full object-cover"
                }
              />
            </div>
          ) : (
            <div className={`flex items-center justify-center text-sm text-muted-foreground ${preserveOriginalRatio ? "min-h-[220px]" : "h-full"}`}>
              No image selected.
            </div>
          )}

          {(isUploading || isPreviewLoading) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/75 backdrop-blur-[2px]">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm font-medium text-foreground">
                {isUploading ? "Uploading image..." : "Loading image..."}
              </p>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelection}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-3xl rounded-[32px] border-border p-0 overflow-hidden">
          <div className="grid gap-0 md:grid-cols-[minmax(0,1.2fr)_360px]">
            <div className="bg-foreground p-6 text-primary-foreground md:p-8">
              <DialogHeader className="mb-5">
                <DialogTitle className="text-2xl">Adjust image</DialogTitle>
                <DialogDescription className="text-primary-foreground/72">
                  Zoom and move the image until it fits smoothly inside the frame.
                </DialogDescription>
              </DialogHeader>

              <div
                className="relative mx-auto overflow-hidden rounded-[28px] border border-white/10 bg-black/20"
                style={{ aspectRatio: `${aspectRatio ?? 1}` }}
              >
                {draftSourceUrl && previewMetrics ? (
                  <img
                    src={draftSourceUrl}
                    alt={`${label} preview`}
                    className="absolute max-w-none select-none pointer-events-none"
                    style={previewMetrics}
                  />
                ) : (
                  <div className="flex h-full min-h-[320px] items-center justify-center text-sm text-primary-foreground/65">
                    Select an image to start editing.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6 p-6 md:p-8">
              <div className="rounded-[24px] border border-border bg-secondary/30 p-4">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ZoomIn className="h-4 w-4 text-primary" />
                  Adjustment controls
                </div>

                <div className="space-y-5">
                  <label className="block space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Zoom</span>
                      <span className="text-muted-foreground">{zoom.toFixed(2)}x</span>
                    </div>
                    <Slider value={[zoom]} min={1} max={2.4} step={0.01} onValueChange={(value) => setZoom(value[0] ?? 1)} />
                  </label>

                  <label className="block space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Move left or right</span>
                      <span className="text-muted-foreground">{offsetX}</span>
                    </div>
                    <Slider value={[offsetX]} min={-100} max={100} step={1} onValueChange={(value) => setOffsetX(value[0] ?? 0)} />
                  </label>

                  <label className="block space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Move up or down</span>
                      <span className="text-muted-foreground">{offsetY}</span>
                    </div>
                    <Slider value={[offsetY]} min={-100} max={100} step={1} onValueChange={(value) => setOffsetY(value[0] ?? 0)} />
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setOffsetX(0);
                  setOffsetY(0);
                }}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary hover:text-primary-foreground"
              >
                Reset adjustments
              </button>

              <DialogFooter className="pt-2 sm:flex-col sm:space-x-0 sm:space-y-3">
                <button
                  type="button"
                  onClick={() => handleDialogOpenChange(false)}
                  className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary hover:text-primary-foreground"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleApply()}
                  disabled={!draftSourceUrl || isUploading}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isUploading ? "Uploading..." : "Apply and Upload"}
                </button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminImageField;

