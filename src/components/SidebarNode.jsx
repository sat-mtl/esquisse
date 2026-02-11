import React, { useState } from "react";
import { useDnD } from "../DnDContext.jsx";


<<<<<<< src/components/SidebarNode.jsx
export function SidebarNode({toolObj}){
    
    
    
    //Makes it so that the node is draggable
    const [type, setType, obj, setObj] = useDnD();

        const onDragStart = (event, nodeType) => {
            setType(nodeType);
            event.dataTransfer.effectAllowed = "move";
            setObj(toolObj);

            //console.log("Object in SidebarNode")
            //console.log(obj);
            
        };

    return (
        
        /* onDragStart(event, "XXX") is where you define the type created when dragged of of the side bar! 
        For us node type will be sandbox which takes in a object defined in ToolObjects.js to work
        App.js transfers the data from this node to the new one on the On*/
        <div className="dndnode input" onDragStart={(event) => onDragStart(event, "sandbox")} draggable> 
            <img className="image" src={`/${toolObj.logoFile}`} alt="/logosat.png" />
            <div className="popup">{toolObj.name} <br /> {toolObj.descr} </div>   
        </div>
=======
export function SidebarNode({tool}){
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
    const [_, setType] = useDnD();
    
    //Moves when dragged
    const onDragStart = (event, nodeType) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = "move";
        setDescr(null);
    };

    //Links to external documentation when clicked
    const handleClick = () => {
        window.open(`${tool.docLink}`, "_blank");
    }

    return (
        <>
            <div className="dndnode input" onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onDragStart={(event) => onDragStart(event, "sandbox")} draggable>
                <img className="image" src={`/${tool.logoImage}`} alt="/logosat.png" />  
            </div>

            {descr && (
                <div className="popup" style={{
                    left: descr.x - 50,
                    top: descr.y,
                }}>
                    <b>{tool.name} </b>
                     <br />
                    {tool.description}
                </div>
            )}
        </>
>>>>>>> src/components/SidebarNode.jsx
    )
}