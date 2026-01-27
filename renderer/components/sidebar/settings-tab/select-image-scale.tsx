import { translationAtom } from "@/atoms/translations-atom";
import { useAtomValue } from "jotai";

type ImageScaleSelectProps = {
  scale: string;
  setScale: React.Dispatch<React.SetStateAction<string>>;
  hideInfo?: boolean;
};

const SCALE_OPTIONS = [
  { value: "1", label: "원본" },
  { value: "2", label: "2배" },
  { value: "4", label: "4배" },
];

export function SelectImageScale({
  scale,
  setScale,
  hideInfo,
}: ImageScaleSelectProps) {
  const t = useAtomValue(translationAtom);

  return (
    <div>
      {!hideInfo && (
        <div className="flex flex-row items-center gap-2">
          <p className="text-sm font-medium">
            {t("SETTINGS.IMAGE_SCALE.TITLE")}
          </p>
        </div>
      )}
      {!hideInfo && (
        <p className="mb-2 text-xs text-base-content/80">
          {t("SETTINGS.IMAGE_SCALE.DESCRIPTION")}
        </p>
      )}

      <div className="flex gap-2">
        {SCALE_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={`btn btn-sm flex-1 ${
              scale === option.value ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setScale(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
