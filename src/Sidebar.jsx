import React from "react";
import { useDnD } from "./DnDContext.jsx";
import { SidebarNode } from "./components/SidebarNode.jsx";
import * as tools from "./ToolObjects.js";


export default () => {
    return (
        <aside>
            <SidebarNode tool={tools.AudioDiceObj} />
            <SidebarNode tool={tools.PoireObj} />
            <SidebarNode tool={tools.LivePoseObj} />
        </aside>
    );
};