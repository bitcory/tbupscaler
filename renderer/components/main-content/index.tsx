"use client";
import useLogger from "../hooks/use-logger";
import { useState, useMemo, useEffect } from "react";
import { ELECTRON_COMMANDS } from "@common/electron-commands";
import { useAtom, useAtomValue } from "jotai";
import {
  batchModeAtom,
  lensSizeAtom,
  savedOutputPathAtom,
  progressAtom,
  viewTypeAtom,
  rememberOutputFolderAtom,
} from "../../atoms/user-settings-atom";
import { useToast } from "@/components/ui/use-toast";
import { sanitizePath } from "@common/sanitize-path";
import getDirectoryFromPath from "@common/get-directory-from-path";
import { FEATURE_FLAGS } from "@common/feature-flags";
import { ImageFormat, isValidImageFormat } from "@/lib/valid-formats";
import ProgressBar from "./progress-bar";
import InstructionsCard from "./instructions-card";
import MoreOptionsDrawer from "./more-options-drawer";
import MacTitlebarDragRegion from "./mac-titlebar-drag-region";
import LensViewer from "./lens-view";
import ImageViewer from "./image-viewer";
import useTranslation from "../hooks/use-translation";
import SliderView from "./slider-view";
import ResultActionBar from "./result-action-bar";

type MainContentProps = {
  imagePath: string;
  resetImagePaths: () => void;
  upscaledBatchFolderPath: string;
  setImagePath: React.Dispatch<React.SetStateAction<string>>;
  validateImagePath: (path: string) => void;
  selectFolderHandler: () => void;
  selectImageHandler: () => void;
  upscaledImagePath: string;
  batchFolderPath: string;
  doubleUpscaylCounter: number;
  setDimensions: React.Dispatch<
    React.SetStateAction<{
      width: number;
      height: number;
    }>
  >;
};

const MainContent = ({
  imagePath,
  resetImagePaths,
  upscaledBatchFolderPath,
  setImagePath,
  validateImagePath,
  selectFolderHandler,
  selectImageHandler,
  upscaledImagePath,
  batchFolderPath,
  doubleUpscaylCounter,
  setDimensions,
}: MainContentProps) => {
  const t = useTranslation();
  const logit = useLogger();
  const { toast } = useToast();

  const [outputPath, setOutputPath] = useAtom(savedOutputPathAtom);
  const progress = useAtomValue(progressAtom);
  const batchMode = useAtomValue(batchModeAtom);

  const viewType = useAtomValue(viewTypeAtom);
  const lensSize = useAtomValue(lensSizeAtom);
  const rememberOutputFolder = useAtomValue(rememberOutputFolderAtom);
  const [zoomAmount, setZoomAmount] = useState("100");

  const sanitizedUpscaledImagePath = useMemo(
    () => sanitizePath(upscaledImagePath),
    [upscaledImagePath],
  );

  const showInformationCard = useMemo(() => {
    if (!batchMode) {
      return imagePath.length === 0 && upscaledImagePath.length === 0;
    } else {
      return (
        batchFolderPath.length === 0 && upscaledBatchFolderPath.length === 0
      );
    }
  }, [
    batchMode,
    imagePath,
    upscaledImagePath,
    batchFolderPath,
    upscaledBatchFolderPath,
  ]);

  // DRAG AND DROP HANDLERS
  const handleDragEnter = (e) => {
    e.preventDefault();
    console.log("drag enter");
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    console.log("drag leave");
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    console.log("drag over");
  };

  const openFolderHandler = (e) => {
    const logit = useLogger();
    logit("📂 OPEN_FOLDER: ", upscaledBatchFolderPath);
    window.electron.send(
      ELECTRON_COMMANDS.OPEN_FOLDER,
      upscaledBatchFolderPath,
    );
  };

  const sanitizedImagePath = useMemo(
    () => sanitizePath(imagePath),
    [imagePath],
  );

  const handleDrop = (e) => {
    e.preventDefault();
    resetImagePaths();
    if (
      e.dataTransfer.items.length === 0 ||
      e.dataTransfer.files.length === 0
    ) {
      logit("👎 No valid files dropped");
      toast({
        title: t("ERRORS.INVALID_IMAGE_ERROR.TITLE"),
        description: t("ERRORS.INVALID_IMAGE_ERROR.ADDITIONAL_DESCRIPTION"),
      });
      return;
    }
    const type = e.dataTransfer.items[0].type;
    const filePath = e.dataTransfer.files[0]?.path;
    const fileObject = e.dataTransfer.files[0];
    logit("⤵️ Dropped file: ", JSON.stringify({ type, filePath, name: fileObject?.name }));

    if (!type.includes("image")) {
      logit("🚫 Invalid file dropped - not an image");
      toast({
        title: t("ERRORS.INVALID_IMAGE_ERROR.TITLE"),
        description: t("ERRORS.INVALID_IMAGE_ERROR.ADDITIONAL_DESCRIPTION"),
      });
      return;
    }

    // If file has a local path (dropped from file system)
    if (filePath) {
      const extension = fileObject?.name?.split(".").at(-1);
      if (extension && isValidImageFormat(extension.toLowerCase())) {
        logit("🖼 Setting image path: ", filePath);
        setImagePath(filePath);
        const dirname = getDirectoryFromPath(filePath);
        logit("🗂 Setting output path: ", dirname);
        if (!FEATURE_FLAGS.APP_STORE_BUILD) {
          if (!rememberOutputFolder) {
            setOutputPath(dirname);
          }
        }
        validateImagePath(filePath);
      } else {
        logit("🚫 Invalid file extension");
        toast({
          title: t("ERRORS.INVALID_IMAGE_ERROR.TITLE"),
          description: t("ERRORS.INVALID_IMAGE_ERROR.ADDITIONAL_DESCRIPTION"),
        });
      }
    } else if (outputPath) {
      // If no local path (dropped from browser), save to temp like paste
      const currentDate = new Date(Date.now());
      const currentTime = `${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}`;
      const mimeExtension = type.split("/")[1] || "png";
      const extensionFromMime = mimeExtension === "jpeg" ? "jpg" : mimeExtension;
      const originalName = fileObject?.name || "";
      const hasExtension = originalName.includes(".") && isValidImageFormat(originalName.split(".").pop()?.toLowerCase() || "");
      const fileName = hasExtension
        ? `paste-${currentTime}-${originalName}`
        : `paste-${currentTime}-image.${extensionFromMime}`;

      const file = {
        name: fileName,
        path: outputPath,
        extension: fileName.split(".").pop() as ImageFormat,
        size: fileObject.size,
        type: type.split("/")[0],
        encodedBuffer: "",
      };

      logit("📋 Saving dropped file: ", JSON.stringify({ name: file.name, path: file.path, extension: file.extension }));

      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result;
        if (result instanceof ArrayBuffer) {
          file.encodedBuffer = Buffer.from(new Uint8Array(result)).toString("base64");
        }
        window.electron.send(ELECTRON_COMMANDS.PASTE_IMAGE, file);
      };
      reader.readAsArrayBuffer(fileObject);
    } else {
      logit("🚫 No output path set for dropped image");
      toast({
        title: t("ERRORS.NO_OUTPUT_FOLDER_ERROR.TITLE"),
        description: t("ERRORS.NO_OUTPUT_FOLDER_ERROR.DESCRIPTION"),
      });
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (outputPath) {
      resetImagePaths();
      if (e.clipboardData.files.length) {
        const fileObject = e.clipboardData.files[0];
        const currentDate = new Date(Date.now());
        const currentTime = `${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}`;

        // Get extension from MIME type (e.g., "image/png" -> "png")
        const mimeExtension = fileObject.type.split("/")[1] || "png";
        const extensionFromMime = mimeExtension === "jpeg" ? "jpg" : mimeExtension;

        // Use original filename if it has extension, otherwise use MIME-based extension
        const originalName = fileObject.name || "";
        const hasExtension = originalName.includes(".") && isValidImageFormat(originalName.split(".").pop()?.toLowerCase() || "");
        const fileName = hasExtension
          ? `paste-${currentTime}-${originalName}`
          : `paste-${currentTime}-image.${extensionFromMime}`;

        const file = {
          name: fileName,
          path: outputPath,
          extension: fileName.split(".").pop() as ImageFormat,
          size: fileObject.size,
          type: fileObject.type.split("/")[0],
          encodedBuffer: "",
        };

        logit(
          "📋 Pasted file: ",
          JSON.stringify({
            name: file.name,
            path: file.path,
            extension: file.extension,
          }),
        );

        if (
          file.type === "image" &&
          isValidImageFormat(file.extension)
        ) {
          const reader = new FileReader();
          reader.onload = async (event) => {
            const result = event.target?.result;
            if (typeof result === "string") {
              file.encodedBuffer = Buffer.from(result, "utf-8").toString(
                "base64",
              );
            } else if (result instanceof ArrayBuffer) {
              file.encodedBuffer = Buffer.from(new Uint8Array(result)).toString(
                "base64",
              );
            } else {
              logit("🚫 Invalid file pasted");
              toast({
                title: t("ERRORS.INVALID_IMAGE_ERROR.TITLE"),
                description: t(
                  "ERRORS.INVALID_IMAGE_ERROR.CLIPBOARD_DESCRIPTION",
                ),
              });
            }
            window.electron.send(ELECTRON_COMMANDS.PASTE_IMAGE, file);
          };
          reader.readAsArrayBuffer(fileObject);
        } else {
          logit("🚫 Invalid file pasted");
          toast({
            title: t("ERRORS.INVALID_IMAGE_ERROR.TITLE"),
            description: t("ERRORS.INVALID_IMAGE_ERROR.CLIPBOARD_DESCRIPTION"),
          });
        }
      } else {
        logit("🚫 Invalid file pasted");
        toast({
          title: t("ERRORS.INVALID_IMAGE_ERROR.TITLE"),
          description: t("ERRORS.INVALID_IMAGE_ERROR.CLIPBOARD_DESCRIPTION"),
        });
      }
    } else {
      toast({
        title: t("ERRORS.NO_OUTPUT_FOLDER_ERROR.TITLE"),
        description: t("ERRORS.NO_OUTPUT_FOLDER_ERROR.DESCRIPTION"),
      });
    }
  };

  useEffect(() => {
    // Events
    const handlePasteEvent = (e) => handlePaste(e);
    const handlePasteImageSaveSuccess = (_: any, imageFilePath: string) => {
      setImagePath(imageFilePath);
      validateImagePath(imageFilePath);
    };
    const handlePasteImageSaveError = (_: any, error: string) => {
      toast({
        title: t("ERRORS.NO_IMAGE_ERROR.TITLE"),
        description: error,
      });
    };
    window.addEventListener("paste", handlePasteEvent);
    window.electron.on(
      ELECTRON_COMMANDS.PASTE_IMAGE_SAVE_SUCCESS,
      handlePasteImageSaveSuccess,
    );
    window.electron.on(
      ELECTRON_COMMANDS.PASTE_IMAGE_SAVE_ERROR,
      handlePasteImageSaveError,
    );
    return () => {
      window.removeEventListener("paste", handlePasteEvent);
    };
  }, [t, outputPath]);

  return (
    <div
      className="relative flex h-screen w-full flex-col items-center justify-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDoubleClick={batchMode ? selectFolderHandler : selectImageHandler}
    >
      <MacTitlebarDragRegion />

      {progress.length > 0 &&
        upscaledImagePath.length === 0 &&
        upscaledBatchFolderPath.length === 0 && (
          <ProgressBar
            batchMode={batchMode}
            progress={progress}
            doubleUpscaylCounter={doubleUpscaylCounter}
            resetImagePaths={resetImagePaths}
          />
        )}

      {/* DEFAULT PANE INFO */}
      {showInformationCard && (
        <InstructionsCard batchMode={batchMode} />
      )}

      <MoreOptionsDrawer
        zoomAmount={zoomAmount}
        setZoomAmount={setZoomAmount}
        resetImagePaths={resetImagePaths}
      />

      {/* SHOW SELECTED IMAGE */}
      {!batchMode && upscaledImagePath.length === 0 && imagePath.length > 0 && (
        <ImageViewer imagePath={imagePath} setDimensions={setDimensions} />
      )}

      {/* BATCH UPSCALE SHOW SELECTED FOLDER */}
      {batchMode &&
        upscaledBatchFolderPath.length === 0 &&
        batchFolderPath.length > 0 && (
          <p className="select-none text-base-content">
            <span className="font-bold">
              {t("APP.PROGRESS.BATCH.SELECTED_FOLDER_TITLE")}
            </span>{" "}
            {batchFolderPath}
          </p>
        )}
      {/* BATCH UPSCALE DONE INFO */}

      {batchMode && upscaledBatchFolderPath.length > 0 && (
        <div className="z-50 flex flex-col items-center gap-4 rounded-2xl border border-base-300/50 bg-base-100 p-8 shadow-apple">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="select-none text-lg font-semibold text-base-content">
            {t("APP.PROGRESS.BATCH.DONE_TITLE")}
          </p>
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary/90 active:scale-[0.98]"
              onClick={openFolderHandler}
            >
              {t("APP.PROGRESS.BATCH.OPEN_UPSCAYLED_FOLDER_TITLE")}
            </button>
            <button
              className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-5 py-2.5 text-sm font-medium text-base-content transition-all hover:bg-base-200 active:scale-[0.98]"
              onClick={resetImagePaths}
            >
              {t("APP.RESULT.NEW_IMAGE") || "New Batch"}
            </button>
          </div>
        </div>
      )}

      {!batchMode && viewType === "lens" && upscaledImagePath && imagePath && (
        <LensViewer
          sanitizedImagePath={sanitizedImagePath}
          sanitizedUpscaledImagePath={sanitizedUpscaledImagePath}
        />
      )}

      {/* COMPARISON SLIDER */}
      {!batchMode &&
        viewType === "slider" &&
        imagePath.length > 0 &&
        upscaledImagePath.length > 0 && (
          <SliderView
            sanitizedImagePath={sanitizedImagePath}
            sanitizedUpscaledImagePath={sanitizedUpscaledImagePath}
            zoomAmount={zoomAmount}
          />
        )}

      {/* RESULT ACTION BAR */}
      {!batchMode && upscaledImagePath.length > 0 && (
        <ResultActionBar
          upscaledImagePath={upscaledImagePath}
          resetImagePaths={resetImagePaths}
        />
      )}
    </div>
  );
};

export default MainContent;
