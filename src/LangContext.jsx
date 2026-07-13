import React, { createContext, useContext, useState } from "react";
import { strings } from "./i18n.js";

const LangContext = createContext(strings.fr);

const detectLang = () => {
    const l = navigator.language || navigator.languages?.[0] || "fr";
    return l.toLowerCase().startsWith("fr") ? "fr" : "en";
};

const warnMissing = (lang, t) => {
    if (process.env.NODE_ENV !== "development") return t;
    return new Proxy(t, {
        get(target, key) {
            if (!(key in target)) console.warn(`[i18n] Missing key "${key}" for lang "${lang}"`);
            return target[key];
        }
    });
};

export const LangProvider = ({ children }) => {
    const [lang, setLang] = useState(detectLang);
    const t = warnMissing(lang, strings[lang]);

    const switchLang = (newLang) => {
        if (document.startViewTransition) {
            document.startViewTransition(() => setLang(newLang));
        } else {
            setLang(newLang);
        }
    };

    return (
        <LangContext.Provider value={{ t, lang, setLang: switchLang }}>
            {children}
        </LangContext.Provider>
    );
};

export const useLang = () => useContext(LangContext);

export function localizedName(toolObj, lang) {
  if (!toolObj) return "";
  return lang === "fr" ? (toolObj.nameFr || toolObj.name) : toolObj.name;
}

export function localizedDesc(toolObj, lang) {
  if (!toolObj) return "";
  return lang === "fr" ? (toolObj.descriptionFr || toolObj.description) : toolObj.description;
}
