"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { ModelId, MODELS } from "@common/models-list";
import { useAtom, useAtomValue } from "jotai";
import { selectedModelIdAtom } from "@/atoms/user-settings-atom";
import { customModelIdsAtom } from "@/atoms/models-list-atom";
import useTranslation from "@/components/hooks/use-translation";

const CUSTOM_MODEL_LABELS: Record<string, string> = {
  "4xHFA2k": "4xHFA2k (애니/일러스트)",
  "4xLSDIR": "4xLSDIR (실사 범용)",
  "4xLSDIRCompactC3": "4xLSDIRCompactC3 (실사 경량)",
  "4xLSDIRplusC": "4xLSDIRplusC (실사 경량+)",
  "4xNomos8kSC": "4xNomos8kSC (실사 고품질)",
  "4x_NMKD-Siax_200k": "4x_NMKD-Siax_200k (범용)",
  "4x_NMKD-Superscale-SP_178000_G": "4x_NMKD-Superscale-SP (초해상도)",
  "RealESRGAN_General_WDN_x4_v3": "RealESRGAN_WDN_x4 (범용+노이즈제거)",
  "RealESRGAN_General_x4_v3": "RealESRGAN_x4 (범용)",
  "realesr-animevideov3-x2": "realesr-anime-x2 (애니 2배)",
  "realesr-animevideov3-x3": "realesr-anime-x3 (애니 3배)",
  "realesr-animevideov3-x4": "realesr-anime-x4 (애니 4배)",
  "uniscale_restore": "uniscale_restore (복원/보정)",
};

const SelectModelDialog = () => {
  const t = useTranslation();
  const [selectedModelId, setSelectedModelId] = useAtom(selectedModelIdAtom);
  const customModelIds = useAtomValue(customModelIdsAtom);

  const handleModelSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModelId(e.target.value);
  };

  return (
    <div className="relative">
      <select
        value={selectedModelId}
        onChange={handleModelSelect}
        className="w-full appearance-none rounded-lg border border-base-300 bg-base-100 px-3 py-2 pr-8 text-sm font-medium text-base-content transition-all hover:bg-base-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {Object.entries(MODELS).map((modelData) => {
          const modelId = modelData[0] as ModelId;
          return (
            <option key={modelId} value={modelId}>
              {t(`APP.MODEL_SELECTION.MODELS.${modelId}.NAME`)}
            </option>
          );
        })}
        {customModelIds.length > 0 && (
          <optgroup label={t("APP.MODEL_SELECTION.IMPORTED_CUSTOM_MODELS")}>
            {customModelIds.map((customModel) => (
              <option key={customModel} value={customModel}>
                {CUSTOM_MODEL_LABELS[customModel] || customModel}
              </option>
            ))}
          </optgroup>
        )}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40" />
    </div>
  );
};

export default SelectModelDialog;
