import React from "react";
import { useDnD } from "../DnDContext.jsx";

export function NodeTemplate(){
    const [_, setType] = useDnD();
    
        const onDragStart = (event, nodeType) => {
            setType(nodeType);
            event.dataTransfer.effectAllowed = "move";
        };

    return (
        <div className="dndnode input" onDragStart={(event) => onDragStart(event, "input")} draggable>
                Input Node
        </div>
    )
}