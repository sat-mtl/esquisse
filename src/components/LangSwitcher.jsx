import React from "react";
import { useLang } from "../LangContext.jsx";

export function LangSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div className="lang-switcher">
      <span
        className={lang === "fr" ? "lang-opt lang-opt--active" : "lang-opt"}
        onClick={() => setLang("fr")}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && setLang("fr")}
      >FR</span>
      <span className="lang-sep">·</span>
      <span
        className={lang === "en" ? "lang-opt lang-opt--active" : "lang-opt"}
        onClick={() => setLang("en")}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && setLang("en")}
      >EN</span>
    </div>
  );
}
