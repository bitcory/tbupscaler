import { FEATURE_FLAGS } from "@common/feature-flags";
import React from "react";
import { useAtomValue } from "jotai";
import { translationAtom } from "@/atoms/translations-atom";

export default function Header({ version }: { version: string }) {
  const t = useAtomValue(translationAtom);

  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-2.5">
        <img
          src="/icon.png"
          alt="Logo"
          className="h-10 w-10 rounded-xl shadow-apple"
        />
        <div className="flex flex-col justify-center">
          <h1 className="text-lg font-semibold tracking-tight text-base-content">
            {t("TITLE")}
          </h1>
          <p className="text-[11px] text-base-content/50">
            {t("HEADER.DESCRIPTION")}{" "}
            <span className="font-medium">
              v{version} {FEATURE_FLAGS.APP_STORE_BUILD && "Mac"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
