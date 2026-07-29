import React from "react";

export default function ContextMenu({ top, left, right, bottom, actions = [], onClose }) {
    return (
        <div
            className="context-menu"
            style={{ top, left, right, bottom }}
            onClick={(e) => e.stopPropagation()}
        >
            {actions.map(({ label, onClick, danger }, i) => (
                <div
                    key={i}
                    className={`context-menu-item${danger ? " context-menu-item--danger" : ""}`}
                    onClick={(e) => { onClick(e); onClose?.(); }}
                >
                    {label}
                </div>
            ))}
        </div>
    );
}
