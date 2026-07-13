import React from "react";
import { useSelectionContext } from "../SelectionContext.jsx";
import { useLang, localizedName, localizedDesc } from "../LangContext.jsx";

export function NodeDetails({ activeTab = 0 }) {
  const [selectedNode, setSelectedNode, hoveredNode, setHoveredNode] = useSelectionContext();
  const { t, lang } = useLang();
  const EMPTY_MESSAGES = [t.emptyTool, t.emptyHardware, t.emptyTemplates];

  if (!selectedNode) {
    return (
      <div className="node-details node-details-empty">
        <p>{EMPTY_MESSAGES[activeTab] ?? EMPTY_MESSAGES[0]}</p>
      </div>
    );
  }

  const handleClick = () => {
    if (selectedNode.docLink && selectedNode.docLink !== ".") {
      window.open(selectedNode.docLink, "_blank", "noopener,noreferrer");
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
          src={`${selectedNode.logoFile}`}
          alt=""
        />
        {doDisplayDocButton && <button type="button" className="node-details-doc-btn" onClick={handleClick}>
          {selectedNode.isIO ? t.dataSheet : t.documentation}
          <svg viewBox="0 0 128 75" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" width="20" height="12" style={{ transform: 'scaleY(-1)' }}>
            <path d="M120.3,67.2l-62-62H0" strokeWidth="10" />
            <path d="M123.9,29v41.7H82.2" strokeWidth="8" />
          </svg>
        </button>}
      </div>}
      <h2 className="node-details-title">{localizedName(selectedNode, lang)}</h2>
      <p className="node-details-desc">{localizedDesc(selectedNode, lang)}</p>

      <div className="node-details-io">
        <div className="node-details-section">
          <h3 className="node-details-label">{t.inputLabel}</h3>
          <div className="node-details-bubbles">
            {inputList.length ? inputList.map((item, i) => (
              <span key={i} className="node-details-bubble">{item}</span>
            )) : <span className="node-details-bubble node-details-bubble--empty">—</span>}
          </div>
        </div>
        <div className="node-details-divider" aria-hidden />
        <div className="node-details-section">
          <h3 className="node-details-label">{t.outputLabel}</h3>
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
