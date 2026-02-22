import React, { useState } from "react";
import { useDnD } from "../DnDContext.jsx";

export function SidebarNode({toolObj}){
    const[descr, setDescr] = useState(null);

    //Description box appears when mouse is inside node
    const handleMouseEnter = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setDescr({
            x: rect.left,
            y: rect.top + rect.height / 2,
        });
    };

    //Description box disappears when mouse is outside node
    const handleMouseLeave = () => {
        setDescr(null);
    }

    //Makes it so that the node is draggable
    const [type, setType, obj, setObj] = useDnD();
    
    //Moves when dragged
    const onDragStart = (event, nodeType) => {
        setType(nodeType);

        setObj(toolObj); //to update toolObj for creating a sandbox node

        event.dataTransfer.effectAllowed = "move";
        setDescr(null);
        
        //debug
        //console.log("On Drag Start");
        //console.log(obj);
    };

    //Links to external documentation when clicked
    const handleClick = () => {
        window.open(`${toolObj.docLink}`, "_blank");
    }

    return (
        <>
            <div className="dndnode input" onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onDragStart={(event) => onDragStart(event, "sandbox")} draggable>
                <img className="image" src={`/${toolObj.logoFile}`} alt="/logosat.png" style={toolObj.logoScale ? { width: `${toolObj.logoScale * 90}%`, height: `${toolObj.logoScale * 90}%` } : undefined} />
            </div>

            {descr && (
                <div className="popup" style={{
                    left: descr.x - 50,
                    top: descr.y,
                }}>
                    <b>{toolObj.name} </b>
                     <br />
                    {toolObj.description}
                </div>
            )}
        </>
    )
}

export function SidebarCompNode({ template }){
    //Makes it so that the node is draggable
    const [type, setType, obj, setObj] = useDnD();

    //Moves when dragged
    const onDragStart = (event) => {
        setType("composite");

        setObj(template); //to update toolObj for creating a sandbox node

        event.dataTransfer.effectAllowed = "move";
        
        //debug
        //console.log("On Drag Start");
        //console.log(obj);
    };

    return(
        <div className="dndnode input" onDragStart={(event) => onDragStart(event, "sandbox")} draggable>
            { template.name } 
        </div>  
    )
}