import { translationAtom } from "@/atoms/translations-atom";
import { useAtomValue } from "jotai";
import React from "react";
import { ImagePlus, FolderOpen } from "lucide-react";

function InstructionsCard({ batchMode }) {
  const t = useAtomValue(translationAtom);

  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-base-300/50 bg-base-100 p-8 shadow-apple">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200">
        {batchMode ? (
          <FolderOpen className="h-8 w-8 text-primary" />
        ) : (
          <ImagePlus className="h-8 w-8 text-primary" />
        )}
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-lg font-semibold text-base-content">
          {batchMode
            ? t("APP.RIGHT_PANE_INFO.SELECT_FOLDER")
            : t("APP.RIGHT_PANE_INFO.SELECT_IMAGE")}
        </p>
        {!batchMode && (
          <p className="text-sm text-base-content/60">
            {t("APP.RIGHT_PANE_INFO.SELECT_IMAGE_SUBTITLE")}
          </p>
        )}
        {batchMode && (
          <p className="w-full max-w-sm text-center text-sm text-base-content/60">
            {t("APP.RIGHT_PANE_INFO.SELECT_FOLDER_DESCRIPTION")}
          </p>
        )}
      </div>
    </div>
  );
}

export default InstructionsCard;
