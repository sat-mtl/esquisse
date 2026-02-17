import React from "react";
import { useDnD } from "../DnDContext.jsx";
import { SidebarNode } from "./SidebarNode.jsx";
import * as tools from "../ToolObjects.js";

export function Toolbar(){
    return(
         <aside>
            <SidebarNode toolObj={tools.AudioDiceObj} />
            <SidebarNode toolObj={tools.PoireObj} />
            <SidebarNode toolObj={tools.LivePoseObj} />
            <SidebarNode toolObj={tools.AudioDiceObj} />
            <SidebarNode toolObj={tools.PoireObj} />
            <SidebarNode toolObj={tools.LivePoseObj} />
            <SidebarNode toolObj={tools.AudioDiceObj} />
            <SidebarNode toolObj={tools.PoireObj} />
            <SidebarNode toolObj={tools.LivePoseObj} />
            <SidebarNode toolObj={tools.AudioDiceObj} />
            <SidebarNode toolObj={tools.PoireObj} />
            <SidebarNode toolObj={tools.LivePoseObj} />
        </aside>
    )
};