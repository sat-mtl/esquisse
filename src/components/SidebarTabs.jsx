import React, { useState } from "react";
import { Toolbar } from "./Toolbar.jsx";
import { Templatebar } from "../Templatebar.jsx";
import { IObar } from "./IObar.jsx";

//Add here to create additional tabs
const tabs = [
    {title: "TOOLS", content: <Toolbar />},
    { title: "I/O DEVICES", content: <IObar />},
    { title: "TEMPLATES", content: <Templatebar /> }
]

export function SidebarTabs({ activeTab, setActiveTab }) {
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