import React from "react";
import { useDnD } from "../DnDContext.jsx";
import { SidebarNode } from "./SidebarNode.jsx";
import * as tools from "../ToolObjects.js";

// mic camera keyboard mouse
export function IObar() {
  return (
    <aside className="tab-content">
      <SidebarNode toolObj={tools.ScreenObj} />
      <SidebarNode toolObj={tools.SpeakerObj} />
      <SidebarNode toolObj={tools.AudiodiceObj} />
      <SidebarNode toolObj={tools.HapticFloorObj} />
      <SidebarNode toolObj={tools.MicObj} />
      <SidebarNode toolObj={tools.CameraObj} />
      <SidebarNode toolObj={tools.KeyboardObj} />
      <SidebarNode toolObj={tools.MouseObj} />
    </aside>
  );
}
