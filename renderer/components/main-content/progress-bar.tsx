import React, { useEffect } from "react";
import { useAtomValue } from "jotai";
import { translationAtom } from "@/atoms/translations-atom";
import { ELECTRON_COMMANDS } from "@common/electron-commands";
import useLogger from "../hooks/use-logger";
import { Loader2, Square } from "lucide-react";

function ProgressBar({
  progress,
  doubleUpscaylCounter,
  batchMode,
  resetImagePaths,
}: {
  progress: string;
  doubleUpscaylCounter: number;
  batchMode: boolean;
  resetImagePaths: () => void;
}) {
  const [batchProgress, setBatchProgress] = React.useState(0);
  const t = useAtomValue(translationAtom);
  const logit = useLogger();

  useEffect(() => {
    const progressString = progress.trim().replace(/\n/g, "");
    if (progressString.includes("Successful")) {
      setBatchProgress((prev) => prev + 1);
    }
  }, [progress]);

  const stopHandler = () => {
    window.electron.send(ELECTRON_COMMANDS.STOP);
    logit("🛑 Stopping Upscayl");
  };

  return (
    <div className="absolute z-50 flex h-full w-full flex-col items-center justify-center bg-base-200/80 backdrop-blur-xl">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-base-300/50 bg-base-100 p-8 shadow-apple-lg">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>

        {batchMode && (
          <p className="text-sm font-medium text-base-content">
            {t("APP.PROGRESS_BAR.BATCH_UPSCAYL_IN_PROGRESS_TITLE")} {batchProgress}
          </p>
        )}

        <div className="flex flex-col items-center gap-1">
          <p className="text-2xl font-semibold text-base-content">
            {progress}
            {!batchMode &&
              doubleUpscaylCounter > 0 &&
              ` - Pass ${doubleUpscaylCounter}`}
          </p>

          <p className="text-sm text-base-content/50">
            {t("APP.PROGRESS_BAR.IN_PROGRESS_TITLE")}
          </p>
        </div>

        <button
          onClick={stopHandler}
          className="mt-2 flex items-center gap-2 rounded-lg border border-base-300 bg-base-100 px-4 py-2 text-sm font-medium text-base-content transition-all hover:bg-base-200 active:scale-[0.98]"
        >
          <Square className="h-3 w-3 fill-current" />
          {t("APP.PROGRESS_BAR.STOP_BUTTON_TITLE")}
        </button>
      </div>
    </div>
  );
}

export default ProgressBar;
