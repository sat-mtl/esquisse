import React, { useState } from "react";
import { useSelectionContext } from "../SelectionContext.jsx";
import { useFlowContext } from "../FlowContext.jsx";
import { useLang } from "../LangContext.jsx";
import { useTapAdd } from "../TapAddContext.jsx";

function unpackProtocols(str) {
    if (!str.trim()) return [];
    return str.split(",").map(s => s.trim()).filter(Boolean);
}

export function CustomNodeEditModal() {
    const [selectedNode, setSelectedNode, , , isShowModal, setIsShowModal, custDropInfo] = useSelectionContext();
    const [nodes, setNodes] = useFlowContext();
    const [ioType, setIoType] = useState("Both");
    const { t } = useLang();
    const tapAddRef = useTapAdd();

    const isDevice = isShowModal === "device";

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

        if (custDropInfo) {
            // came from a drag — place at drop position
            const [position, id] = custDropInfo;
            setNodes(nds => nds.concat({
                id: "dndNode_" + id,
                type: "sandbox",
                position,
                data: { toolObj: customNode },
            }));
        } else {
            // came from a click — place at canvas center
            tapAddRef.current?.("sandbox", customNode);
        }
    };

    return (
        <div className="modal-wrapper">
            <div className="modal-body">
                <h1 className="landing-title">
                    {isDevice ? t.customHardwareTitle : t.customSoftwareTitle}
                </h1>
                <button type="button" onClick={() => setIsShowModal(null)}>{t.customClose}</button>

                <form className="custom-form" onSubmit={handleSubmit} method="POST">
                    <label htmlFor="objName">{isDevice ? t.customHardwareName : t.customSoftwareName}</label>
                    <input type="text" id="objName" name="objName"
                        pattern="^[a-zA-Z0-9!?&#%$\. ]*$"
                        title={t.inputValidation} required />

                    <label htmlFor="desc">{t.customDescription}</label>
                    <input type="text" id="desc" name="desc"
                        pattern="^[a-zA-Z0-9!?&%$\. ]*$"
                        title={t.inputValidation} required />

                    {isDevice && (
                        <>
                            <label htmlFor="ioType">{t.customDirection}</label>
                            <select id="ioType" value={ioType} onChange={e => setIoType(e.target.value)}>
                                <option value="Both">{t.customDirectionBoth}</option>
                                <option value="Input">{t.customDirectionInput}</option>
                                <option value="Output">{t.customDirectionOutput}</option>
                            </select>
                        </>
                    )}

                    <p>{t.customProtocolsHint}</p>

                    <label htmlFor="inputField">{t.customInputProtocols}</label>
                    <input type="text" id="inputField" name="inputField"
                        placeholder="OSC, MIDI, Audio Stream, ..."
                        pattern="^[a-zA-Z, ]*$" />

                    <label htmlFor="outputField">{t.customOutputProtocols}</label>
                    <input type="text" id="outputField" name="outputField"
                        placeholder="OSC, MIDI, Audio Stream, ..."
                        pattern="^[a-zA-Z, ]*$" />

                    <button type="submit">{t.customSubmit}</button>
                </form>
            </div>
        </div>
    );
}


export function SidebarCustomNode() {
    const [descr, setDescr] = useState(null);
    const [, , , , , setIsShowModal, , setCustDropInfo] = useSelectionContext();
    const { t } = useLang();

    const handleMouseEnter = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setDescr({ x: rect.left, y: rect.top + rect.height / 2 + 50 });
    };

    const handleClick = () => {
        setCustDropInfo(null);
        setIsShowModal("tool");
        setDescr(null);
    };

    return (
        <>
            <div
                className="dndnode input dndnode--add"
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setDescr(null)}
            >
                <span className="custom-node-plus">+</span>
            </div>
            {descr && (
                <div className="popup" style={{ left: descr.x - 50, top: descr.y }}>
                    <p>{t.customSoftwareTooltip}</p>
                </div>
            )}
        </>
    );
}


export function SidebarCustomDevice() {
    const [descr, setDescr] = useState(null);
    const [, , , , , setIsShowModal, , setCustDropInfo] = useSelectionContext();
    const { t } = useLang();

    const handleMouseEnter = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setDescr({ x: rect.left, y: rect.top + rect.height / 2 + 50 });
    };

    const handleClick = () => {
        setCustDropInfo(null);
        setIsShowModal("device");
        setDescr(null);
    };

    return (
        <>
            <div
                className="dndnode input dndnode--add"
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setDescr(null)}
            >
                <span className="custom-node-plus">+</span>
            </div>
            {descr && (
                <div className="popup" style={{ left: descr.x - 50, top: descr.y }}>
                    <p>{t.customHardwareTooltip}</p>
                </div>
            )}
        </>
    );
}
