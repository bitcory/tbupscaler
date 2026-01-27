import { useAtom, useAtomValue } from "jotai";
import React, { useEffect, useMemo } from "react";
import { Tooltip } from "react-tooltip";
import useLogger from "../../hooks/use-logger";
import {
  savedOutputPathAtom,
  progressAtom,
  rememberOutputFolderAtom,
  scaleAtom,
} from "../../../atoms/user-settings-atom";
import { FEATURE_FLAGS } from "@common/feature-flags";
import { ELECTRON_COMMANDS } from "@common/electron-commands";
import { useToast } from "@/components/ui/use-toast";
import { translationAtom } from "@/atoms/translations-atom";
import { SelectImageScale } from "../settings-tab/select-image-scale";
import SelectModelDialog from "./select-model-dialog";
import { ImageFormat } from "@/lib/valid-formats";
import { ImagePlus, FolderOpen, FolderOutput, Sparkles, HelpCircle, Layers, Check, ChevronRight } from "lucide-react";

interface IProps {
  selectImageHandler: () => Promise<void>;
  selectFolderHandler: () => Promise<void>;
  upscaylHandler: () => Promise<void>;
  batchMode: boolean;
  setBatchMode: React.Dispatch<React.SetStateAction<boolean>>;
  imagePath: string;
  doubleUpscayl: boolean;
  setDoubleUpscayl: React.Dispatch<React.SetStateAction<boolean>>;
  dimensions: {
    width: number | null;
    height: number | null;
  };
  setSaveImageAs: React.Dispatch<React.SetStateAction<ImageFormat>>;
  setGpuId: React.Dispatch<React.SetStateAction<string>>;
}

function UpscaylSteps({
  selectImageHandler,
  selectFolderHandler,
  upscaylHandler,
  batchMode,
  setBatchMode,
  imagePath,
  doubleUpscayl,
  setDoubleUpscayl,
  dimensions,
}: IProps) {
  const [scale, setScale] = useAtom(scaleAtom);
  const [outputPath, setOutputPath] = useAtom(savedOutputPathAtom);
  const [progress, setProgress] = useAtom(progressAtom);
  const rememberOutputFolder = useAtomValue(rememberOutputFolderAtom);

  const logit = useLogger();
  const { toast } = useToast();
  const t = useAtomValue(translationAtom);

  const outputHandler = async () => {
    const path = await window.electron.invoke(ELECTRON_COMMANDS.SELECT_FOLDER);
    if (path !== null) {
      logit("🗂 Setting Output Path: ", path);
      setOutputPath(path);
    } else {
      setOutputPath(null);
    }
  };

  const upscaylResolution = useMemo(() => {
    const newDimensions = {
      width: dimensions.width,
      height: dimensions.height,
    };

    let doubleScale = parseInt(scale) * parseInt(scale);
    let singleScale = parseInt(scale);

    if (doubleUpscayl) {
      newDimensions.width = dimensions.width * doubleScale;
      newDimensions.height = dimensions.height * doubleScale;
    } else {
      newDimensions.width = dimensions.width * singleScale;
      newDimensions.height = dimensions.height * singleScale;
    }

    return newDimensions;
  }, [dimensions.width, dimensions.height, doubleUpscayl, scale]);

  const isImageSelected = imagePath.length > 0;
  const isOutputSelected = outputPath && outputPath.length > 0;
  const canUpscale = isImageSelected && isOutputSelected && progress.length === 0;

  return (
    <div
      className={`animate-step-in animate flex h-screen flex-col gap-6 overflow-y-auto overflow-x-hidden p-3`}
    >
      {/* BATCH OPTION */}
      <div className="flex flex-row items-center justify-between rounded-lg bg-base-200 p-2.5">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-base-content/60" />
          <span
            className="cursor-help text-sm font-medium text-base-content"
            data-tooltip-id="tooltip"
            data-tooltip-content={t("APP.BATCH_MODE.DESCRIPTION")}
          >
            {t("APP.BATCH_MODE.TITLE")}
          </span>
        </div>
        <input
          type="checkbox"
          className="toggle toggle-sm"
          defaultChecked={batchMode}
          onClick={() => {
            if (!rememberOutputFolder) {
              setOutputPath("");
            }
            setProgress("");
            setBatchMode((oldValue) => !oldValue);
          }}
        />
      </div>

      {/* STEP 1 - Select Image */}
      <div className="animate-step-in rounded-xl border border-base-300/50 bg-base-100 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${isImageSelected ? 'bg-success text-white' : 'bg-base-200 text-base-content/50'}`}>
              {isImageSelected ? <Check className="h-3.5 w-3.5" /> : '1'}
            </div>
            <p className="text-sm font-semibold text-base-content">{t("APP.FILE_SELECTION.TITLE")}</p>
          </div>
          {isImageSelected && (
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
              {t("APP.STATUS.SELECTED") || "Selected"}
            </span>
          )}
        </div>
        <button
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all active:scale-[0.98] ${
            isImageSelected
              ? 'border border-base-300 bg-base-100 text-base-content hover:bg-base-200'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
          onClick={!batchMode ? selectImageHandler : selectFolderHandler}
          data-tooltip-id="tooltip"
          data-tooltip-content={imagePath}
        >
          {batchMode ? (
            <FolderOpen className="h-4 w-4" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          {isImageSelected
            ? (t("APP.FILE_SELECTION.CHANGE") || "Change Image")
            : (batchMode
              ? t("APP.FILE_SELECTION.BATCH_MODE_TYPE")
              : t("APP.FILE_SELECTION.SINGLE_MODE_TYPE"))}
        </button>
      </div>

      {/* STEP 2 - Model Selection */}
      <div className="animate-step-in group flex flex-col gap-2 rounded-xl border border-base-300/50 bg-base-100 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
            2
          </div>
          <p className="text-sm font-semibold text-base-content">{t("APP.MODEL_SELECTION.TITLE")}</p>
        </div>

        <SelectModelDialog />

        {!batchMode && (
          <div className="flex items-center justify-between rounded-lg bg-base-200 px-2.5 py-1.5">
            <div className="flex items-center gap-2">
              <span
                className="cursor-pointer text-sm font-medium text-base-content"
                onClick={() => setDoubleUpscayl((prev) => !prev)}
              >
                {t("APP.DOUBLE_UPSCAYL.TITLE")}
              </span>
              <HelpCircle
                className="h-3.5 w-3.5 cursor-help text-base-content/40"
                data-tooltip-id="tooltip"
                data-tooltip-content={t("APP.DOUBLE_UPSCAYL.DESCRIPTION")}
              />
            </div>
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={doubleUpscayl}
              onChange={(e) => setDoubleUpscayl(e.target.checked)}
            />
          </div>
        )}

        <SelectImageScale scale={scale} setScale={setScale} hideInfo />
      </div>

      {/* STEP 3 - Output Path */}
      <div className="animate-step-in rounded-xl border border-base-300/50 bg-base-100 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${isOutputSelected ? 'bg-success text-white' : 'bg-base-200 text-base-content/50'}`}>
              {isOutputSelected ? <Check className="h-3.5 w-3.5" /> : '3'}
            </div>
            <p className="text-sm font-semibold text-base-content">
              {t("APP.OUTPUT_PATH_SELECTION.TITLE")}
            </p>
            {FEATURE_FLAGS.APP_STORE_BUILD && (
              <HelpCircle
                className="h-3.5 w-3.5 cursor-pointer text-base-content/40"
                onClick={() =>
                  alert(t("APP.OUTPUT_PATH_SELECTION.MAC_APP_STORE_ALERT"))
                }
              />
            )}
          </div>
          {isOutputSelected && (
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
              {t("APP.STATUS.SET") || "Set"}
            </span>
          )}
        </div>
        {!batchMode && !FEATURE_FLAGS.APP_STORE_BUILD && (
          <p className="mb-2 text-xs text-base-content/50">
            {t("APP.OUTPUT_PATH_SELECTION.DEFAULT_IMG_PATH")}
          </p>
        )}
        <button
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all active:scale-[0.98] ${
            isOutputSelected
              ? 'border border-base-300 bg-base-100 text-base-content hover:bg-base-200'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
          data-tooltip-content={outputPath}
          data-tooltip-id="tooltip"
          onClick={outputHandler}
        >
          <FolderOutput className="h-4 w-4" />
          {isOutputSelected
            ? (t("APP.OUTPUT_PATH_SELECTION.CHANGE") || "Change Folder")
            : t("APP.OUTPUT_PATH_SELECTION.BUTTON_TITLE")}
        </button>
      </div>

      {/* STEP 4 - Upscale */}
      <div className="animate-step-in rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-3">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-xs font-semibold text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <p className="text-sm font-semibold text-base-content">{t("APP.SCALE_SELECTION.TITLE")}</p>
        </div>

        {dimensions.width && dimensions.height && (
          <div className="mb-2 flex items-center gap-2 rounded-lg bg-base-100 p-1.5">
            <span className="text-xs text-base-content/60">
              {dimensions.width} x {dimensions.height}
            </span>
            <ChevronRight className="h-3 w-3 text-base-content/40" />
            <span className="text-xs font-semibold text-primary">
              {upscaylResolution.width} x {upscaylResolution.height}
            </span>
          </div>
        )}

        <button
          disabled={!canUpscale}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${
            canUpscale
              ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-apple hover:opacity-90'
              : 'cursor-not-allowed bg-base-300 text-base-content/40'
          }`}
          onClick={
            progress.length > 0 || !outputPath
              ? () =>
                  toast({
                    description: t(
                      "APP.SCALE_SELECTION.NO_OUTPUT_FOLDER_ALERT",
                    ),
                  })
              : upscaylHandler
          }
        >
          {progress.length > 0
            ? t("APP.SCALE_SELECTION.IN_PROGRESS_BUTTON_TITLE")
            : t("APP.SCALE_SELECTION.START_BUTTON_TITLE")}
        </button>

        {!canUpscale && progress.length === 0 && (
          <p className="mt-2 text-center text-xs text-base-content/50">
            {!isImageSelected && (t("APP.HINTS.SELECT_IMAGE_FIRST") || "Select an image first")}
            {isImageSelected && !isOutputSelected && (t("APP.HINTS.SELECT_OUTPUT_FIRST") || "Select output folder")}
          </p>
        )}
      </div>
    </div>
  );
}

export default UpscaylSteps;
