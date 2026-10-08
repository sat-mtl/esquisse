import React from "react";

export default function ContextMenu({ top, left, right, bottom, actions = [], onClose }) {
    return (
        <div
            className="context-menu"
            style={{ top, left, right, bottom }}
            onClick={(e) => e.stopPropagation()}
        >
            {actions.map((action, i) => (
                action.swatches ? (
                    <div key={i} className="context-menu-swatches">
                        {action.swatches.map(({ color, onClick, active }, j) => (
                            <button
                                key={j}
                                type="button"
                                aria-label={color || "default"}
                                className={`context-menu-swatch${active ? " context-menu-swatch--active" : ""}${!color ? " context-menu-swatch--default" : ""}`}
                                style={color ? { backgroundColor: color } : undefined}
                                onClick={(e) => { onClick(e); onClose?.(); }}
                            />
                        ))}
                    </div>
                ) : (
                    <div
                        key={i}
                        className={`context-menu-item${action.danger ? " context-menu-item--danger" : ""}`}
                        onClick={(e) => { action.onClick(e); onClose?.(); }}
                    >
                        {action.label}
                    </div>
                )
            ))}
        </div>
    );
}
