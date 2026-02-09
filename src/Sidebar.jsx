import React from "react";
import { useDnD } from "./DnDContext.jsx";
import { SidebarNode } from "./components/SidebarNode.jsx";
import * as tools from "./ToolObjects.js";



export default () => {
    return (
        <aside>
            <SidebarNode name={tools.OssiaObj.name} logoFileName={tools.OssiaObj.logoImage} />
            <SidebarNode logoFileName="Switcher.png" />           
        </aside>
    );
};