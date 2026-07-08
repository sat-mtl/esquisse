import React, { useState } from "react";
import { useDnD } from "../DnDContext.jsx";
import { useTapAdd } from "../TapAddContext.jsx";

const isTouchDevice = () => typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

export function SidebarNode({toolObj}){
    const[descr, setDescr] = useState(null);
    const tapAddRef = useTapAdd();

    //Description box appears when mouse is inside node
    const handleMouseEnter = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setDescr({
            x: rect.left,
            y: rect.top + rect.height / 2 + 50,
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
        
    };

    const handleClick = () => {
        setDescr(null);
        if (isTouchDevice() && tapAddRef.current) {
            tapAddRef.current("sandbox", toolObj);
        }
    };

    //Links to external documentation when clicked
    const handleDoubleClick = () => {
        if (toolObj.docLink && toolObj.docLink !== ".") {
            window.open(toolObj.docLink, "_blank", "noopener,noreferrer");
        }
    }

    return (
        <>
            <div className={`dndnode input${toolObj.isSAT ? " dndnode--sat" : ""}`} onClick={handleClick} onDoubleClick={handleDoubleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onDragStart={(event) => onDragStart(event, "sandbox")} draggable>
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
    const [descr, setDescr] = useState(null);
    const [type, setType, obj, setObj] = useDnD();
    const tapAddRef = useTapAdd();

    const handleMouseEnter = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setDescr({
            x: rect.left,
            y: rect.top + rect.height / 2 + 50,
        });
    };

    const handleMouseLeave = () => setDescr(null);

    const onDragStart = (event) => {
        setType("composite");
        setObj(template);
        event.dataTransfer.effectAllowed = "move";
        setDescr(null);
    };

    const handleClick = () => {
        setDescr(null);
        if (isTouchDevice() && tapAddRef.current) {
            tapAddRef.current("composite", null, template);
        }
    };

    const initials = (template.name || "?")
        .split(" ")
        .slice(0, 2)
        .map(w => w[0])
        .join("")
        .toUpperCase();

    return (
        <>
            <div
                className="dndnode input"
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onDragStart={onDragStart}
                draggable
                style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--color-blue)", overflow: "visible" }}
            >
                {initials}
            </div>

            {descr && (
                <div className="popup" style={{ left: descr.x - 50, top: descr.y }}>
                    <b>{template.name}</b>
                    <br />
                    {template.description}
                </div>
            )}
        </>
    );
}