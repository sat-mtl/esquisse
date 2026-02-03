import React from "react";
import { useDnD } from "../DnDContext.jsx";

export function NodeTemplate({logoFileName}){
    //Makes it so that the node is draggable
    const [_, setType] = useDnD();
    
        const onDragStart = (event, nodeType) => {
            setType(nodeType);
            event.dataTransfer.effectAllowed = "move";
        };

    return (
        /*TODO Find code for where the node behaves in the play area*/
        <div className="dndnode input" onDragStart={(event) => onDragStart(event, "image")} draggable>
                <img className="image" src={`/images/${logoFileName}`} alt="/logosat.png" />              
        </div>
    )
}