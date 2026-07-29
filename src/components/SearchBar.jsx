import React from "react";
import { useLang } from "../LangContext.jsx";

export function SearchBar({ query, onChange }) {
    const { t } = useLang();

    return (
        <div className="tool-search">
            <input
                type="text"
                value={query}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                aria-label={t.searchPlaceholder}
            />
            {query && (
                <button
                    type="button"
                    className="tool-search-clear"
                    aria-label={t.clearSearch}
                    onClick={() => onChange("")}
                >
                    ×
                </button>
            )}
        </div>
    );
}
