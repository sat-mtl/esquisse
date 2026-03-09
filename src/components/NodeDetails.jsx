import React from "react";
import { useSelectionContext } from "../SelectionContext.jsx";

export function NodeDetails() {
  const [selectedNode, setSelectedNode, hoveredNode, setHoveredNode] = useSelectionContext();

  if (!selectedNode) {
    return (
      <div className="node-details node-details-empty">
        <p>Drag and drop a tool or device to the canvas to see its details here.</p>
      </div>
    );
  }

  const handleClick = () => {
    if(docLink != "."){
      window.open(`${selectedNode.docLink}`, "_blank");
    }
  };

  const inputList = Array.isArray(selectedNode.input) ? selectedNode.input : [];
  const outputList = Array.isArray(selectedNode.output) ? selectedNode.output : [];


  //do not display empty fields
  let doDisplayDocButton = false;
  if (selectedNode.docLink != "."){
    doDisplayDocButton = true;
  }

  let doDisplayImage = false;
  if (selectedNode.logoFile != ""){
    doDisplayDocButton = true;
  }

  let doDisplayHeader = true;
  if(doDisplayDocButton == false && doDisplayImage == false){ //nothing in header
    doDisplayHeader = false;
  }

  return (
    <div className="node-details node-details-visible">
      {doDisplayHeader && <div className="node-details-header">
        <img
          className="node-details-logo"
          src={`/${selectedNode.logoFile}`}
          alt=""
        />
        {doDisplayDocButton && <button type="button" className="node-details-doc-btn" onClick={handleClick}>
          Documentation
        </button>}
      </div>}
      <h2 className="node-details-title">{selectedNode.name}</h2>
      <p className="node-details-desc">{selectedNode.description}</p>

      <div className="node-details-io">
        <div className="node-details-section">
          <h3 className="node-details-label">Input</h3>
          <div className="node-details-bubbles">
            {inputList.length ? inputList.map((item, i) => (
              <span key={i} className="node-details-bubble">{item}</span>
            )) : <span className="node-details-bubble node-details-bubble--empty">—</span>}
          </div>
        </div>
        <div className="node-details-divider" aria-hidden />
        <div className="node-details-section">
          <h3 className="node-details-label">Output</h3>
          <div className="node-details-bubbles">
            {outputList.length ? outputList.map((item, i) => (
              <span key={i} className="node-details-bubble">{item}</span>
            )) : <span className="node-details-bubble node-details-bubble--empty">—</span>}
          </div>
        </div>
      </div>
    </div>
  );
}