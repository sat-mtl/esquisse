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
      <SidebarNode toolObj={tools.RaspberryPiObj} />
      <SidebarNode toolObj={tools.HeadphoneObj} />
      <SidebarNode toolObj={tools.OrbbecFemtoObj} />
      <SidebarNode toolObj={tools.NetworkSwitchObj} />
      <SidebarNode toolObj={tools.RouterObj} />
      <SidebarNode toolObj={tools.ProjectorObj} />
      <SidebarNode toolObj={tools.MidiControllerObj} />
      <SidebarNode toolObj={tools.IMUMicrocontrollerObj} />
      <SidebarNode toolObj={tools.ComputerObj} />
      <SidebarNode toolObj={tools.LeapMotionObj} />
    </aside>
  );
}
