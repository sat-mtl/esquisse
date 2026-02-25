import React from "react";
import { useDnD } from "./DnDContext.jsx";
import { SidebarTabs } from "./components/SidebarTabs.jsx";
import { Toolbar } from "./components/Toolbar.jsx";
import { NodeDetails } from "./components/NodeDetails.jsx";

export default () => {
    
    return (
            <aside className="sidebar">
                <SidebarTabs/>
                <NodeDetails />
            </aside>
    );
};