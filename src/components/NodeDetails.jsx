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
      
      <div className = "simple-inline"> 
        <img
          src={`/${selectedNode.logoFile}`}
        />
        <button href={selectedNode.docLink} target="_blank" rel="noopener noreferrer">Documentation</button>
      </div>

      <h2>{selectedNode.name}</h2>
      <p>{selectedNode.description}</p>
    


      <div className= "parent-grid">
        <div className="child-grid">
          <h3>Input</h3>
          <p>{selectedNode.input}</p>
          
        </div>
        <div className="vertical-line child-grid"></div>
        <div className="child-grid right-align">
          <h3>Output</h3>
          <p>{selectedNode.output}</p>
          
        </div>
      </div>

    </div>
  );
}