import { translationAtom } from "@/atoms/translations-atom";
import { useAtomValue } from "jotai";
import React from "react";

function Footer() {
  const t = useAtomValue(translationAtom);

  return (
    <div className="mt-auto border-t border-base-300/50 px-4 py-2 text-center">
      <p className="text-[11px] text-base-content/40">
        {t("FOOTER.COPYRIGHT")} {new Date().getFullYear()}{" "}
        <span className="font-medium text-base-content/50">TBUPSCALER</span>
      </p>
    </div>
  );
}

export default Footer;
