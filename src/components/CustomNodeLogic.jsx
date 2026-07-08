import React, { useState } from "react";
import SandboxNode from "./SandboxNode.jsx";
import { useSelectionContext } from "../SelectionContext.jsx";
import { useDnD } from "../DnDContext.jsx";
import { useFlowContext } from "../FlowContext.jsx";

export function CustomNodeButton() {
    const [, , , , isShowModal, setIsShowModal] = useSelectionContext();
    return (
        <button type="button" onClick={() => setIsShowModal("tool")}>
            Custom Node
        </button>
    );
}

function unpackProtocols(str) {
    if (!str.trim()) return [];
    return str.split(",").map(s => s.trim()).filter(Boolean);
}

export function CustomNodeEditModal() {
    const [selectedNode, setSelectedNode, , , isShowModal, setIsShowModal, custDropInfo, setCustDropInfo] = useSelectionContext();
    const [nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange] = useFlowContext();
    const [ioType, setIoType] = useState("Both");

    const isDevice = isShowModal === "device";

    const addCustomNode = (custObj) => {
        const [position, id] = custDropInfo;
        setNodes(nds => nds.concat({
            id: "dndNode_" + id,
            type: "sandbox",
            position,
            data: { toolObj: custObj },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById("objName").value.trim();
        const desc = document.getElementById("desc").value.trim();
        const inputStr = document.getElementById("inputField").value;
        const outputStr = document.getElementById("outputField").value;

        const customNode = {
            name,
            logoFile: "",
            description: desc,
            input: unpackProtocols(inputStr),
            output: unpackProtocols(outputStr),
            docLink: ".",
            ...(isDevice && {
                isIO: true,
                ...(ioType !== "Both" && { IOType: ioType }),
            }),
        };

        setSelectedNode(customNode);
        setIsShowModal(null);
        addCustomNode(customNode);
    };

    return (
        <div className="modal-wrapper">
            <div className="modal-body">
                <h1 className="landing-title">
                    {isDevice ? "Custom Device" : "Custom Node"}
                </h1>
                <button type="button" onClick={() => setIsShowModal(null)}>Close</button>

                <form className="custom-form" onSubmit={handleSubmit} method="POST">
                    <label htmlFor="objName">{isDevice ? "Device name" : "Tool name"}</label>
                    <input type="text" id="objName" name="objName"
                        pattern="^[a-zA-Z0-9!?&#%$\. ]*$"
                        title="Only characters, numbers, and basic punctuation" required />

                    <label htmlFor="desc">Description</label>
                    <input type="text" id="desc" name="desc"
                        pattern="^[a-zA-Z0-9!?&%$\. ]*$"
                        title="Only characters, numbers, and basic punctuation" required />

                    {isDevice && (
                        <>
                            <label htmlFor="ioType">Direction</label>
                            <select id="ioType" value={ioType} onChange={e => setIoType(e.target.value)}>
                                <option value="Both">Input &amp; Output</option>
                                <option value="Input">Input only (sends signal)</option>
                                <option value="Output">Output only (receives signal)</option>
                            </select>
                        </>
                    )}

                    <p>List protocols separated by commas. Connections are case-sensitive.</p>

                    <label htmlFor="inputField">Input protocols</label>
                    <input type="text" id="inputField" name="inputField"
                        placeholder="OSC, MIDI, Audio Stream, ..."
                        pattern="^[a-zA-Z, ]*$" />

                    <label htmlFor="outputField">Output protocols</label>
                    <input type="text" id="outputField" name="outputField"
                        placeholder="OSC, MIDI, Audio Stream, ..."
                        pattern="^[a-zA-Z, ]*$" />

                    <button type="submit">Add to canvas</button>
                </form>
            </div>
        </div>
    );
}


export function SidebarCustomNode() {
    const [descr, setDescr] = useState(null);
    const [type, setType, obj, setObj] = useDnD();

    const handleMouseEnter = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setDescr({ x: rect.left, y: rect.top + rect.height / 2 + 50 });
    };

    const onDragStart = (event) => {
        setType("custSandbox");
        setObj(null);
        event.dataTransfer.effectAllowed = "move";
        setDescr(null);
    };

    return (
        <>
            <div className="dndnode input" id="sidebar-custom-node"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setDescr(null)}
                onDragStart={onDragStart}
                draggable>
                <h3>Custom Node</h3>
            </div>
            {descr && (
                <div className="popup" style={{ left: descr.x - 50, top: descr.y }}>
                    <p>Add a custom software tool. Drag out to use.</p>
                </div>
            )}
        </>
    );
}


export function SidebarCustomDevice() {
    const [descr, setDescr] = useState(null);
    const [type, setType, obj, setObj] = useDnD();

    const handleMouseEnter = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setDescr({ x: rect.left, y: rect.top + rect.height / 2 + 50 });
    };

    const onDragStart = (event) => {
        setType("custDevice");
        setObj(null);
        event.dataTransfer.effectAllowed = "move";
        setDescr(null);
    };

    return (
        <>
            <div className="dndnode input"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setDescr(null)}
                onDragStart={onDragStart}
                draggable>
                <h3>Custom Device</h3>
            </div>
            {descr && (
                <div className="popup" style={{ left: descr.x - 50, top: descr.y }}>
                    <p>Add a custom hardware device. Drag out to use.</p>
                </div>
            )}
        </>
    );
}
