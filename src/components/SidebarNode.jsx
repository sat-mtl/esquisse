import React, { useState } from "react";
import { useDnD } from "../DnDContext.jsx";


export function SidebarNode({tool}){
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
        <>
            <div className="dndnode input" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onDragStart={(event) => onDragStart(event, "image")} draggable>
                <img className="image" src={`/${tool.logoImage}`} alt="/logosat.png" />  
            </div>

            {descr && (
                <div className="popup" style={{
                    left: descr.x - 50,
                    top: descr.y,
                }}>{tool.name} <br /></div>
            )}
        </>
    )
}