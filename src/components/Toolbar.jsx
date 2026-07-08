import React, { useState } from "react";
import { SidebarNode } from "./SidebarNode.jsx";
import { SidebarCustomNode } from "./CustomNodeLogic.jsx";
import { ProtocolFilter } from "./ProtocolFilter.jsx";
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

export function Toolbar() {
    const [activeProtocol, setActiveProtocol] = useState(null);

    const filtered = activeProtocol
        ? toolList.filter(t => t.input?.includes(activeProtocol) || t.output?.includes(activeProtocol))
        : toolList;

    return (
        <aside className="tab-content">
            <ProtocolFilter tools={toolList} activeProtocol={activeProtocol} onSelect={setActiveProtocol} />
            <div className="tab-nodes">
                <SidebarCustomNode />
                {filtered.map(tool => (
                    <SidebarNode key={tool.name} toolObj={tool} />
                ))}
            </div>
        </aside>
    );
}
