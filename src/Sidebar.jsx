import React, { useState } from "react";
import { SidebarTabs } from "./components/SidebarTabs.jsx";
import { NodeDetails } from "./components/NodeDetails.jsx";

export default () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <aside className="sidebar">
      <SidebarTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <NodeDetails activeTab={activeTab} />
    </aside>
  );
};