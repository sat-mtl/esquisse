import React from "react";
import { Toolbar } from "./Toolbar.jsx";
import { Templatebar } from "../Templatebar.jsx";
import { IObar } from "./IObar.jsx";
import { useLang } from "../LangContext.jsx";

export function SidebarTabs({ activeTab, setActiveTab }) {
    const { t } = useLang();

    const tabs = [
        { title: t.tabSoftware, content: <Toolbar /> },
        { title: t.tabHardware, content: <IObar /> },
        { title: t.tabTemplates, content: <Templatebar /> },
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
                {tabs[activeTab].content}
            </div>
        </div>
    );
}
