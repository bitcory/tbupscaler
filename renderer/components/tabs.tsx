import { translationAtom } from "@/atoms/translations-atom";
import { useAtomValue } from "jotai";
import React from "react";
import { Sparkles, Settings } from "lucide-react";

type TabsProps = {
  selectedTab: number;
  setSelectedTab: (tab: number) => void;
};

const Tabs = ({ selectedTab, setSelectedTab }: TabsProps) => {
  const t = useAtomValue(translationAtom);

  return (
    <div className="mx-3 mb-2 flex gap-1 rounded-xl bg-base-200 p-1">
      <button
        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
          selectedTab === 0
            ? "bg-base-100 text-base-content shadow-apple"
            : "text-base-content/60 hover:text-base-content"
        }`}
        onClick={() => {
          setSelectedTab(0);
        }}
      >
        <Sparkles className="h-4 w-4" />
        {t("TITLE")}
      </button>
      <button
        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
          selectedTab === 1
            ? "bg-base-100 text-base-content shadow-apple"
            : "text-base-content/60 hover:text-base-content"
        }`}
        onClick={() => {
          setSelectedTab(1);
        }}
      >
        <Settings className="h-4 w-4" />
        {t("SETTINGS.TITLE")}
      </button>
    </div>
  );
};

export default Tabs;
