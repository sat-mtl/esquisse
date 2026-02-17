import React from "react";
import { useDnD } from "./DnDContext.jsx";
import { SidebarTabs } from "./components/SidebarTabs.jsx";
import { Toolbar } from "./components/Toolbar.jsx";

export default () => {
    return (
        <div className="col">
            <SidebarTabs />
        </div>
    );
};