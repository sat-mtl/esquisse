import React from "react";
import { useDnD } from "../DnDContext.jsx";
import { SidebarNode } from "./SidebarNode.jsx";
import * as tools from "../ToolObjects.js";


export function IObar() {
  return (
    <aside className="tab-content">
      <SidebarNode toolObj={tools.ScreenObj} />
      <SidebarNode toolObj={tools.SpeakerObj} />
      <SidebarNode toolObj={tools.AudiodiceObj} />
      <SidebarNode toolObj={tools.HapticFloorObj} />
    </aside>
  );
}
