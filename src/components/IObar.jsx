import React, { useState } from "react";
import { SidebarNode } from "./SidebarNode.jsx";
import { SidebarCustomDevice } from "./CustomNodeLogic.jsx";
import { SearchBar } from "./SearchBar.jsx";
import { filterTools } from "../filterTools.js";
import { useLang } from "../LangContext.jsx";
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
    const [query, setQuery] = useState("");
    const { lang } = useLang();

    const filtered = filterTools(deviceList, query, { lang });

    return (
        <aside className="tab-content">
            <SearchBar query={query} onChange={setQuery} />
            <div className="tab-nodes">
                {filtered.map(device => (
                    <SidebarNode key={device.name} toolObj={device} />
                ))}
                <SidebarCustomDevice />
            </div>
        </aside>
    );
}
