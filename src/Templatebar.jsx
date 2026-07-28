import React, { useState } from "react";
import { SidebarCompNode } from "./components/SidebarNode.jsx";
import { SearchBar } from "./components/SearchBar.jsx";
import { filterTools } from "./filterTools.js";
import { useLang } from "./LangContext.jsx";

// Auto-loads all JSON files from src/templates/ — add a file there and it appears here
const templateContext = require.context('./templates', false, /\.json$/);
const allTemplates = templateContext.keys().map(key => templateContext(key));

export function Templatebar() {
    const [query, setQuery] = useState("");
    const { lang } = useLang();

    const filtered = filterTools(allTemplates, query, { lang });

    return (
        <div className="tab-content tab-content--templates">
            <SearchBar query={query} onChange={setQuery} />
            {filtered.map((template, i) => (
                <SidebarCompNode key={i} template={template} />
            ))}
        </div>
    );
}
