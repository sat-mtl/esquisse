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
            <SidebarNode toolObj={tools.KoaiaObj} />
            <SidebarNode toolObj={tools.AbletonLiveObj} />
            <SidebarNode toolObj={tools.ArdourObj} />
            <SidebarNode toolObj={tools.BitwigObj} />
            <SidebarNode toolObj={tools.BlenderObj} />
            <SidebarNode toolObj={tools.ChataigneObj} />
            <SidebarNode toolObj={tools.CinderObj} />
            <SidebarNode toolObj={tools.CubaseObj} />
            <SidebarNode toolObj={tools.IsadoraObj} />
            <SidebarNode toolObj={tools.LeapMotionObj} />
            <SidebarNode toolObj={tools.MadMapperObj} />
            <SidebarNode toolObj={tools.MaxMSPObj} />
            <SidebarNode toolObj={tools.NotchObj} />
            <SidebarNode toolObj={tools.OBSStudioObj} />
            <SidebarNode toolObj={tools.P5jsObj} />
            <SidebarNode toolObj={tools.ProcessingObj} />
            <SidebarNode toolObj={tools.PureDataObj} />
            <SidebarNode toolObj={tools.ReaperObj} />
            <SidebarNode toolObj={tools.ResolumeObj} />
            <SidebarNode toolObj={tools.SmodeObj} />
            <SidebarNode toolObj={tools.SplashObj} />
            <SidebarNode toolObj={tools.SuperColliderObj} />
            <SidebarNode toolObj={tools.TouchDesignerObj} />
            <SidebarNode toolObj={tools.UnrealEngineObj} />
            <SidebarNode toolObj={tools.VCVRackObj} />
            <SidebarNode toolObj={tools.VDMXObj} />
            <SidebarNode toolObj={tools.VezerObj} />
            <SidebarNode toolObj={tools.VRChatObj} />
            <SidebarNode toolObj={tools.VVVVObj} />
            <SidebarNode toolObj={tools.WwiseObj} />
        </aside>
    )
};