import React from "react";

export default function Landing({ onButtonClick }) {
  return (
    <div className="modal-wrapper">
      <div className="modal-body">
        <h1 className="landing-title">
          Welcome to the SAT's Toolbox node editor
          <span className="landing-info-wrap">
            <span className="landing-info-icon" aria-label="About this tool" tabIndex={0}>i</span>
            <span className="landing-info-tooltip">
              This tool helps you visualize connections between different software and plan workflows. Use it to see how SAT's technologies interact with other tools.
            </span>
          </span>
        </h1>
        <ol className="landing-steps">
          <li>
            <span className="landing-step-circle">1</span>
            <span className="landing-step-text">Drag a tool or device from the sidebar and drop it onto the canvas.</span>
          </li>
          <li>
            <span className="landing-step-circle">2</span>
            <span className="landing-step-text">Connect nodes by dragging from the left handle of one to the right handle of another.</span>
          </li>
          <li>
            <span className="landing-step-circle">3</span>
            <span className="landing-step-text">Click a tool in the sidebar or on the canvas to open its documentation or website.</span>
          </li>
          <li>
            <span className="landing-step-circle">4</span>
            <span className="landing-step-text">Use the example templates in the sidebar to get started.</span>
          </li>
        </ol>
        <div className="landing-actions">
          <button type="button" onClick={onButtonClick}>
            UNDERSTOOD
          </button>
          <span className="landing-note">
            You can reopen this anytime with the <strong>Instructions</strong> button in the top bar.
          </span>
        </div>
      </div>
    </div>
  );
}