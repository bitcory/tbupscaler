import { sanitizePath } from "@common/sanitize-path";
import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

const ImageViewer = ({
  imagePath,
  setDimensions,
}: {
  imagePath: string;
  setDimensions: (dimensions: { width: number; height: number }) => void;
}) => {
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  return (
    <div className="relative flex h-full w-full items-center justify-center p-8">
      {/* Checkerboard background for transparency */}
      <div className="absolute inset-0 checkerboard opacity-30" />

      {/* Image */}
      <img
        src={"file:///" + sanitizePath(imagePath)}
        onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
          const dims = {
            width: e.currentTarget.naturalWidth,
            height: e.currentTarget.naturalHeight,
          };
          setDimensions(dims);
          setImageSize(dims);
        }}
        draggable="false"
        alt=""
        className="relative z-10 max-h-full max-w-full rounded-lg object-contain shadow-apple-lg"
      />

      {/* Image info badge */}
      {imageSize && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-base-300/50 bg-base-100/90 px-3 py-1.5 shadow-apple backdrop-blur-sm">
          <ImageIcon className="h-3.5 w-3.5 text-base-content/60" />
          <span className="text-xs font-medium text-base-content/70">
            {imageSize.width} x {imageSize.height}
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
