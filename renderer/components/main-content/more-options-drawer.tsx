import { translationAtom } from "@/atoms/translations-atom";
import {
  lensSizeAtom,
  userStatsAtom,
  viewTypeAtom,
} from "@/atoms/user-settings-atom";
import { cn } from "@/lib/utils";
import { useAtom, useAtomValue } from "jotai";
import { EllipsisIcon, WrenchIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import useSystemInfo from "../hooks/use-system-info";

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const MoreOptionsDrawer = ({
  zoomAmount,
  setZoomAmount,
  resetImagePaths,
}: {
  zoomAmount: string;
  setZoomAmount: (arg: any) => void;
  resetImagePaths: () => void;
}) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [viewType, setViewType] = useAtom(viewTypeAtom);
  const [lensSize, setLensSize] = useAtom(lensSizeAtom);
  const t = useAtomValue(translationAtom);
  const userStats = useAtomValue(userStatsAtom);

  const { systemInfo } = useSystemInfo();
  console.log("🚀 => systemInfo:", systemInfo);

  useEffect(() => {
    if (!localStorage.getItem("zoomAmount")) {
      localStorage.setItem("zoomAmount", zoomAmount);
    } else {
      setZoomAmount(localStorage.getItem("zoomAmount"));
    }
  }, []);

  return (
    <div
      onDoubleClick={(e) => {
        e.stopPropagation();
      }}
      className={`fixed right-0 top-0 z-50 h-screen w-[24rem] border-l border-base-300/50 bg-base-100 text-base-content shadow-apple-lg transition-all duration-300 ${
        openSidebar ? "right-0" : "-right-full translate-x-full"
      }`}
    >
      <div
        className={`group absolute right-[100%] top-1/2 z-50 flex cursor-pointer items-center gap-2 rounded-l-xl border border-r-0 border-base-300/50 bg-base-100 p-3 shadow-apple transition-all duration-300 hover:bg-base-200`}
        onClick={() => {
          setOpenSidebar(!openSidebar);
        }}
      >
        <EllipsisIcon
          className={cn(
            "h-5 w-5 text-base-content/60 transition-transform duration-300",
            openSidebar ? "rotate-90" : "rotate-0",
          )}
        />
      </div>

      <div className="flex h-full flex-col overflow-hidden p-5">
        <div className="flex flex-col gap-4">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary/90 active:scale-[0.98]"
            onClick={resetImagePaths}
          >
            {t("APP.MORE_OPTIONS_DRAWER.RESET_BUTTON_TITLE")}
          </button>

          <div className="flex flex-row items-center justify-between rounded-xl bg-base-200 px-4 py-3">
            <p className="text-sm font-medium text-base-content/60">
              {t("APP.MORE_OPTIONS_DRAWER.LENS_VIEW_TITLE")}
            </p>
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={viewType === "slider"}
              onChange={(e) => {
                setViewType(e.target.checked ? "slider" : "lens");
              }}
            />
            <p className="text-sm font-medium text-base-content">
              {t("APP.MORE_OPTIONS_DRAWER.SLIDER_VIEW_TITLE")}
            </p>
          </div>

          {viewType !== "lens" && (
            <div className="flex flex-col gap-2 rounded-xl bg-base-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-base-content">
                  {t("APP.MORE_OPTIONS_DRAWER.ZOOM_AMOUNT_TITLE")}
                </p>
                <span className="rounded-md bg-base-100 px-2 py-0.5 text-sm font-semibold text-primary">
                  {zoomAmount}%
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step={10}
                className="range range-sm range-primary"
                value={parseInt(zoomAmount)}
                onChange={(e) => {
                  setZoomAmount(e.target.value);
                  localStorage.setItem("zoomAmount", e.target.value);
                }}
              />
            </div>
          )}
        </div>

        <div className="mt-5 flex min-h-0 flex-1 flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
            Stats
          </p>

          <div className="flex flex-col gap-2 overflow-y-auto">
            <div className="rounded-xl bg-base-200 p-3">
              <div className="text-xs text-base-content/50">
                {t("APP.MORE_OPTIONS_DRAWER.TOTAL_UPSCAYLS")}
              </div>
              <div className="text-xl font-semibold text-base-content">
                {userStats.totalUpscayls}
              </div>
            </div>

            <div className="rounded-xl bg-base-200 p-3">
              <div className="text-xs text-base-content/50">
                {t("APP.MORE_OPTIONS_DRAWER.TOTAL_BATCH_UPSCAYLS")}
              </div>
              <div className="text-xl font-semibold text-base-content">
                {userStats.batchUpscayls}
              </div>
            </div>

            <div className="rounded-xl bg-base-200 p-3">
              <div className="text-xs text-base-content/50">
                {t("APP.MORE_OPTIONS_DRAWER.TOTAL_IMAGE_UPSCAYLS")}
              </div>
              <div className="text-xl font-semibold text-base-content">
                {userStats.imageUpscayls}
              </div>
            </div>

            <div className="rounded-xl bg-base-200 p-3">
              <div className="text-xs text-base-content/50">
                {t("APP.MORE_OPTIONS_DRAWER.TOTAL_DOUBLE_UPSCAYLS")}
              </div>
              <div className="text-xl font-semibold text-base-content">
                {userStats.doubleUpscayls}
              </div>
            </div>

            <div className="rounded-xl bg-base-200 p-3">
              <div className="text-xs text-base-content/50">
                {t("APP.MORE_OPTIONS_DRAWER.AVERAGE_UPSCAYL_TIME")}
              </div>
              <div className="text-xl font-semibold text-base-content">
                {formatDuration(userStats.averageUpscaylTime / 1000)}
              </div>
            </div>

            <div className="rounded-xl bg-base-200 p-3">
              <div className="text-xs text-base-content/50">
                {t("APP.MORE_OPTIONS_DRAWER.LAST_UPSCAYL_DURATION")}
              </div>
              <div className="text-xl font-semibold text-base-content">
                {formatDuration(userStats.lastUpscaylDuration / 1000)}
              </div>
            </div>

            <div className="rounded-xl bg-base-200 p-3">
              <div className="text-xs text-base-content/50">
                {t("APP.MORE_OPTIONS_DRAWER.LAST_USED_AT")}
              </div>
              <div className="text-lg font-semibold text-base-content">
                {new Date(userStats.lastUsedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreOptionsDrawer;
