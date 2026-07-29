import React from "react";
import { SidebarNode } from "./SidebarNode.jsx";
import { SidebarCustomNode } from "./CustomNodeLogic.jsx";
import { filterTools } from "../filterTools.js";
import { useLang } from "../LangContext.jsx";
import * as tools from "../ToolObjects.js";

const toolList = [
    tools.AbletonLiveObj, tools.ArdourObj, tools.BitwigObj, tools.BlenderObj,
    tools.ChataigneObj, tools.CinderObj, tools.CubaseObj, tools.DomeportObj,
    tools.IsadoraObj, tools.KoaiaObj, tools.LivePoseObj, tools.MadMapperObj,
    tools.MaxMSPObj, tools.NotchObj, tools.OBSStudioObj, tools.P5jsObj,
    tools.PointMapperObj, tools.ProcessingObj, tools.PuaraObj, tools.PureDataObj,
    tools.ReaperObj, tools.ResolumeObj, tools.SatelliteObj, tools.ScoreObj,
    tools.SmodeObj, tools.SpatgrisObj, tools.SplashObj, tools.SuperColliderObj,
    tools.TouchDesignerObj, tools.UnrealEngineObj, tools.VCVRackObj, tools.VDMXObj,
    tools.VezerObj, tools.VRChatObj, tools.VVVVObj, tools.WwiseObj,
].sort((a, b) => {
    if (a.isSAT && !b.isSAT) return -1;
    if (!a.isSAT && b.isSAT) return 1;
    return a.name.localeCompare(b.name);
});

export function Toolbar({ query }) {
    const { lang } = useLang();

    const filtered = filterTools(toolList, query, { lang });

    return (
        <aside className="tab-content">
            <div className="tab-nodes">
                {filtered.map(tool => (
                    <SidebarNode key={tool.name} toolObj={tool} />
                ))}
                <SidebarCustomNode />
            </div>
        </aside>
    );
}
