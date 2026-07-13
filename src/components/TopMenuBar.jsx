import React, { useRef } from "react";
import { useLang } from "../LangContext.jsx";
import { LangSwitcher } from "./LangSwitcher.jsx";

export function TopMenuBar({
  onDownload,
  onUpload,
  onInstructions,
  onNewFile,
  flowName,
  setFlowName,
  flowDescription,
  setFlowDescription,
  hasNodes,
}) {
  const fileInputRef = useRef(null);
  const { t, lang, setLang } = useLang();

  return (
    <div className="top-menu-bar">
      <div className="top-menu-bar-row">
        <div className="top-menu-bar-logo">
          <img src="logosat.png" alt="SAT" className="sat-logo" />
        </div>
        <div className="top-menu-bar-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={e => { onUpload(e); e.target.value = ""; }}
            className="top-menu-bar-file-input"
            aria-label="Browse and load diagram"
          />
          <button type="button" onClick={onInstructions} className="top-menu-bar-instructions">
            {t.instructions}
          </button>
          <button
            type="button"
            onClick={onNewFile}
            disabled={!hasNodes}
            className="top-menu-bar-new"
            title="Clear canvas"
          >
            {t.newFile}
          </button>
          <button type="button" onClick={onDownload}>
            {t.download}
          </button>
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            {t.upload}
          </button>
        </div>
        <LangSwitcher />
      </div>
      {hasNodes && (
        <div className="top-menu-bar-flow-meta">
          <input
            type="text"
            className="flow-name-input"
            placeholder={t.flowNamePlaceholder}
            value={flowName}
            onChange={e => setFlowName(e.target.value)}
          />
          <input
            type="text"
            className="flow-description-input"
            placeholder={t.flowDescriptionPlaceholder}
            value={flowDescription}
            onChange={e => setFlowDescription(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
