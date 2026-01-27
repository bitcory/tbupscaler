import React, { useCallback, useState } from "react";
import { ReactCompareSlider } from "react-compare-slider";
import useTranslation from "../hooks/use-translation";

const SliderView = ({
  sanitizedImagePath,
  sanitizedUpscaledImagePath,
  zoomAmount,
}: {
  sanitizedImagePath: string;
  sanitizedUpscaledImagePath: string;
  zoomAmount: string;
}) => {
  const t = useTranslation();

  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");

  const handleMouseMove = useCallback((e: any) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  }, []);

  return (
    <ReactCompareSlider
      itemOne={
        <>
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-base-content/60" />
            <span className="text-xs font-medium text-white">
              {t("APP.SLIDER.ORIGINAL_TITLE")}
            </span>
          </div>

          <img
            src={"file:///" + sanitizedImagePath}
            alt={t("APP.SLIDER.ORIGINAL_TITLE")}
            onMouseMove={handleMouseMove}
            style={{
              objectFit: "contain",
              backgroundPosition: "0% 0%",
              transformOrigin: backgroundPosition,
            }}
            className={`h-full w-full bg-base-200 transition-transform group-hover:scale-[${zoomAmount}%]`}
          />
        </>
      }
      itemTwo={
        <>
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/80 px-3 py-1.5 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-white" />
            <span className="text-xs font-medium text-white">
              {t("APP.SLIDER.UPSCAYLED_TITLE")}
            </span>
          </div>
          <img
            src={"file:///" + sanitizedUpscaledImagePath}
            alt={t("APP.SLIDER.UPSCAYLED_TITLE")}
            style={{
              objectFit: "contain",
              backgroundPosition: "0% 0%",
              transformOrigin: backgroundPosition,
            }}
            onMouseMove={handleMouseMove}
            className={`h-full w-full bg-base-200 transition-transform group-hover:scale-[${
              zoomAmount || "100%"
            }%]`}
          />
        </>
      }
      className="group h-screen"
    />
  );
};

export default SliderView;
