import { SaveOutputFolderToggle } from "./save-output-folder-toggle";
import { CustomModelsFolderSelect } from "./select-custom-models-folder";
import { SelectImageScale } from "./select-image-scale";
import { SelectImageFormat } from "./select-image-format";
import React, { useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { customModelsPathAtom, scaleAtom } from "@/atoms/user-settings-atom";
import { InputCompression } from "./input-compression";
import OverwriteToggle from "./overwrite-toggle";
import { ResetSettingsButton } from "./reset-settings-button";
import TurnOffNotificationsToggle from "./turn-off-notifications-toggle";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./language-switcher";
import { translationAtom } from "@/atoms/translations-atom";
import { ImageFormat } from "@/lib/valid-formats";
import TTAModeToggle from "./tta-mode-toggle";
import SystemInfo from "./system-info";

interface IProps {
  batchMode: boolean;
  saveImageAs: ImageFormat;
  setSaveImageAs: React.Dispatch<React.SetStateAction<ImageFormat>>;
  compression: number;
  setCompression: React.Dispatch<React.SetStateAction<number>>;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setDontShowCloudModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function SettingsTab({
  batchMode,
  compression,
  setCompression,
  saveImageAs,
  setSaveImageAs,
}: IProps) {
  const [customModelsPath, setCustomModelsPath] = useAtom(customModelsPathAtom);
  const [scale, setScale] = useAtom(scaleAtom);
  const [enableScrollbar, setEnableScrollbar] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);
  const t = useAtomValue(translationAtom);

  // HANDLERS
  const setExportType = (format: ImageFormat) => {
    setSaveImageAs(format);
  };

  const handleCompressionChange = (e) => {
    setCompression(e.target.value);
  };

  function disableScrolling() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    setTimeoutId(
      setTimeout(function () {
        setEnableScrollbar(false);
      }, 1000),
    );
  }

  function enableScrolling() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    setEnableScrollbar(true);
  }

  return (
    <div
      className={cn(
        "animate-step-in animate z-50 flex h-screen flex-col gap-6 overflow-y-auto overflow-x-hidden p-3",
        enableScrollbar ? "" : "hide-scrollbar",
      )}
      onScroll={() => {
        if (enableScrollbar) disableScrolling();
      }}
      onWheel={() => {
        enableScrolling();
      }}
    >
      <div className="rounded-xl border border-base-300/50 bg-base-100 p-3">
        <LanguageSwitcher />
      </div>

      {/* IMAGE FORMAT BUTTONS */}
      <div className="rounded-xl border border-base-300/50 bg-base-100 p-3">
        <SelectImageFormat
          batchMode={batchMode}
          saveImageAs={saveImageAs}
          setExportType={setExportType}
        />
      </div>

      {/* IMAGE SCALE */}
      <div className="rounded-xl border border-base-300/50 bg-base-100 p-3">
        <SelectImageScale scale={scale} setScale={setScale} />
      </div>

      <div className="rounded-xl border border-base-300/50 bg-base-100 p-3">
        <InputCompression
          compression={compression}
          handleCompressionChange={handleCompressionChange}
        />
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-base-300/50 bg-base-100 p-3">
        <SaveOutputFolderToggle />
        <OverwriteToggle />
        <TurnOffNotificationsToggle />
      </div>

      {/* CUSTOM MODEL */}
      <div className="rounded-xl border border-base-300/50 bg-base-100 p-3">
        <CustomModelsFolderSelect
          customModelsPath={customModelsPath}
          setCustomModelsPath={setCustomModelsPath}
        />
      </div>

      <div className="rounded-xl border border-base-300/50 bg-base-100 p-3">
        <TTAModeToggle />
      </div>

      {/* RESET SETTINGS */}
      <div className="rounded-xl border border-base-300/50 bg-base-100 p-3">
        <ResetSettingsButton />
      </div>

      <div className="rounded-xl border border-base-300/50 bg-base-100 p-3">
        <SystemInfo />
      </div>
    </div>
  );
}

export default SettingsTab;
