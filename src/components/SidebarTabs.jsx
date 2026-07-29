import React, { useState } from "react";
import { Toolbar } from "./Toolbar.jsx";
import { Templatebar } from "../Templatebar.jsx";
import { IObar } from "./IObar.jsx";
import { SearchBar } from "./SearchBar.jsx";
import { useLang } from "../LangContext.jsx";

export function SidebarTabs({ activeTab, setActiveTab }) {
    const { t } = useLang();
    const [query, setQuery] = useState("");

    const tabs = [
        { title: t.tabSoftware, content: <Toolbar query={query} /> },
        { title: t.tabHardware, content: <IObar query={query} /> },
        { title: t.tabTemplates, content: <Templatebar query={query} /> },
    ];

    return (
        <div className="top-section-sidebar">
            <div className="menu-bar">
                {tabs.map((tab, i) => (
                    <button
                        key={i}
                        className={activeTab === i ? "active" : ""}
                        onClick={() => setActiveTab(i)}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>
            <div className="tab-wrapper">
                <SearchBar query={query} onChange={setQuery} />
                {tabs[activeTab].content}
            </div>
        </div>
    );
}
