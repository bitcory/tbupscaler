import { translationAtom } from "@/atoms/translations-atom";
import { useAtomValue } from "jotai";
import { FolderOpen, Download, RotateCcw, Check } from "lucide-react";
import { ELECTRON_COMMANDS } from "@common/electron-commands";
import getDirectoryFromPath from "@common/get-directory-from-path";

type ResultActionBarProps = {
  upscaledImagePath: string;
  resetImagePaths: () => void;
};

const ResultActionBar = ({
  upscaledImagePath,
  resetImagePaths,
}: ResultActionBarProps) => {
  const t = useAtomValue(translationAtom);

  const openFolderHandler = () => {
    const folderPath = getDirectoryFromPath(upscaledImagePath);
    window.electron.send(ELECTRON_COMMANDS.OPEN_FOLDER, folderPath);
  };

  return (
    <div className="absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-base-300/50 bg-base-100/95 p-2 shadow-apple-lg backdrop-blur-xl">
      {/* Success indicator */}
      <div className="flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success">
          <Check className="h-3 w-3 text-white" />
        </div>
        <span className="text-sm font-medium text-success">
          {t("APP.RESULT.UPSCALE_COMPLETE") || "Upscale Complete"}
        </span>
      </div>

      <div className="h-6 w-px bg-base-300" />

      {/* Open folder button */}
      <button
        onClick={openFolderHandler}
        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary/90 active:scale-[0.98]"
      >
        <Download className="h-4 w-4" />
        {t("APP.RESULT.OPEN_FOLDER") || "Open Folder"}
      </button>

      {/* New image button */}
      <button
        onClick={resetImagePaths}
        className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-4 py-2 text-sm font-medium text-base-content transition-all hover:bg-base-200 active:scale-[0.98]"
      >
        <RotateCcw className="h-4 w-4" />
        {t("APP.RESULT.NEW_IMAGE") || "New Image"}
      </button>
    </div>
  );
};

export default ResultActionBar;
