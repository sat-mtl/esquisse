import React, { useRef } from "react";
import { CustomNodeButton } from "./CustomNodeLogic.jsx";

export function TopMenuBar({
  onDownload,
  onSave,
  onRestore,
  onUpload,
  onInstructions,
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="top-menu-bar">
      <div className="top-menu-bar-logo">
        <img src="/logosat.png" alt="SAT" className="sat-logo" />
      </div>
      <div className="top-menu-bar-actions">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={onUpload}
          className="top-menu-bar-file-input"
          aria-label="Browse and load diagram"
        />
        <button type="button" onClick={onInstructions} className="top-menu-bar-instructions">
          INSTRUCTIONS
        </button>
        <button type="button" onClick={onSave}>
          SAVE
        </button>
        <button type="button" onClick={onRestore}>
          RESTORE
        </button>
        <button type="button" onClick={onDownload}>
          DOWNLOAD
        </button>
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          UPLOAD
        </button>
        
      </div>
    </div>
  );
}
