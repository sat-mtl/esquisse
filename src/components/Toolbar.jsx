import React from "react";
import { useDnD } from "../DnDContext.jsx";
import { SidebarNode } from "./SidebarNode.jsx";
import * as tools from "../ToolObjects.js";

export function Toolbar(){
    return(
         <aside>        
            <SidebarNode toolObj={tools.DomeportObj} />
            <SidebarNode toolObj={tools.LivePoseObj} />
            <SidebarNode toolObj={tools.PointMapperObj} />
            <SidebarNode toolObj={tools.PuaraObj} />
            <SidebarNode toolObj={tools.SatelliteObj} />
            <SidebarNode toolObj={tools.ScoreObj} />
            <SidebarNode toolObj={tools.SpatgrisObj} />
        </aside>
    )
};