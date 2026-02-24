import React, { use, useCallback } from "react";
import { useReactFlow } from "@xyflow/react";

export default function ContextMenu({
    top,
    left,
    right,
    bottom,
    actions = [],
}) {

    return (
        <div
            className="context-menu"
            style={{ top, left, right, bottom }}
            onClick={(e) => e.stopPropagation()}
        >
            {actions.map(({ label, onClick, component }, i) => (
                <div  key={ i } onClick={ onClick }>
                    { component ? component : <div onClick={onClick}> { label } </div>}
                </div>
            ))}
        </div>
    );
}
