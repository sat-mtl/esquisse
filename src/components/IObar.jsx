import React, { useState } from "react";
import { SidebarNode } from "./SidebarNode.jsx";
import { SidebarCustomDevice } from "./CustomNodeLogic.jsx";
import { ProtocolFilter } from "./ProtocolFilter.jsx";
import * as tools from "../ToolObjects.js";

const deviceList = [
    tools.ScreenObj, tools.SpeakerObj, tools.AudiodiceObj, tools.HapticFloorObj,
    tools.MicObj, tools.CameraObj, tools.KeyboardObj, tools.MouseObj,
    tools.RaspberryPiObj, tools.HeadphoneObj, tools.OrbbecFemtoObj,
    tools.NetworkSwitchObj, tools.RouterObj, tools.ProjectorObj,
    tools.MidiControllerObj, tools.IMUMicrocontrollerObj, tools.ComputerObj,
    tools.LeapMotionObj,
].map(t => ({ ...t, isIO: true })).sort((a, b) => {
    if (a.isSAT && !b.isSAT) return -1;
    if (!a.isSAT && b.isSAT) return 1;
    return a.name.localeCompare(b.name);
});

export function IObar() {
    const [activeProtocol, setActiveProtocol] = useState(null);

    const filtered = activeProtocol
        ? deviceList.filter(t => t.input?.includes(activeProtocol) || t.output?.includes(activeProtocol))
        : deviceList;

    return (
        <aside className="tab-content">
            <ProtocolFilter tools={deviceList} activeProtocol={activeProtocol} onSelect={setActiveProtocol} />
            <div className="tab-nodes">
                {filtered.map(device => (
                    <SidebarNode key={device.name} toolObj={device} />
                ))}
                <SidebarCustomDevice />
            </div>
        </aside>
    );
}
