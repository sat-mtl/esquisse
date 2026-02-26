import React from "react";
import { useDnD } from "../DnDContext.jsx";
import { SidebarNode } from "./SidebarNode.jsx";
import * as tools from "../ToolObjects.js";
import { useSelectionContext } from "../SelectionContext.jsx";

export function NodeDetails() {
  const [selectedNode, setSelectedNode, hoveredNode, setHoveredNode] = useSelectionContext();

  if (!selectedNode) {
    return (
      <div className="node-details">
        <p>Drag and drop a node from the sidebar to see its details.</p>
      </div>
    );
  }

  console.log(selectedNode);

  return (
    <div className="node-details">
      <h2>{selectedNode.name}</h2>
      <p>{selectedNode.description}</p>
      <a href={selectedNode.docLink} target="_blank" rel="noopener noreferrer">Documentation</a>
    </div>
  );
}