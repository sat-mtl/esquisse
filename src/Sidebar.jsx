import React from "react";
import { useDnD } from "./DnDContext.jsx";
import { SidebarNode } from "./components/SidebarNode.jsx";
import * as tools from "./ToolObjects.js";


export default () => {
    return (
        <aside>
            <SidebarNode toolObj={tools.AudioDiceObj} />
            <SidebarNode toolObj={tools.PoireObj} />
            <SidebarNode toolObj={tools.LivePoseObj} />
        </aside>
    );
};