import React, { useState } from "react";
import { useDnD } from "../DnDContext.jsx";


export function SidebarNode({name, logoFileName}){
    const[descr, setDescr] = useState(null);

    const handleMouseEnter = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setDescr({
            text: name,
            x: rect.left,
            y: rect.top + rect.height / 2,
        });
    };

    const handleMouseLeave = () => {
        setDescr(null);
    }

    //Makes it so that the node is draggable
    const [_, setType] = useDnD();
    
        const onDragStart = (event, nodeType) => {
            setType(nodeType);
            event.dataTransfer.effectAllowed = "move";
        };

    return (
        /*TODO Find code for where the node behaves in the play area*/
        <>
            <div className="dndnode input" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onDragStart={(event) => onDragStart(event, "image")} draggable>
                <img className="image" src={`/${logoFileName}`} alt="/logosat.png" />  
            </div>

            {descr && (
                <div className="popup" style={{
                    left: descr.x - 50,
                    top: descr.y,
                }}>{name} <br /></div>
            )}
        </>
    )
}