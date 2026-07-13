import React, { memo, useCallback } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { useSelectionContext } from "../SelectionContext.jsx";
import { useLang, localizedName } from "../LangContext.jsx";

const isTouchDevice = () => typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

/*
Sandbox nodes are nodes that take in a toolObj feild that contains information on
the details of an object. It is assumed that created nodes have a valid toolObj passed to them.
You can find the requirments of a toolObj at the top of ToolObjects.js

Sandbox nodes are meant to be used outside of the sidebar
*/

export default memo(({ data, isConnectable, selected }) => {
  //get context info
  const [selectedNode, setSelectedNode, hoveredNode, setHoveredNode] =
    useSelectionContext();
  const { deleteElements } = useReactFlow();
  const { lang, t } = useLang();

  if (data.toolObj == null) {
    return (
      <>
        <p>{t.nodeError}</p>
        <p>{t.nodeErrorDetail}</p>
      </>
    );
  }

  const handleDoubleClick = useCallback(() => {
    if (isTouchDevice()) {
      deleteElements({ nodes: [{ id: data.id }] });
      setSelectedNode(null);
    } else if (data.toolObj.docLink && data.toolObj.docLink !== ".") {
      window.open(data.toolObj.docLink, "_blank", "noopener,noreferrer");
    }
  }, [data.id, data.toolObj, deleteElements, setSelectedNode]);

  //update selected obj on click
  const handleClick = useCallback(() => {
    if (!data?.toolObj) {
      setSelectedNode(null);
      return;
    }
    const nodeToSelect = { id: data.id, ...data.toolObj };
    setSelectedNode(nodeToSelect);
  }, [setSelectedNode, data?.id, data?.toolObj]);
  let obj = data.toolObj;

  let doDisplayImage = true;
  if(data.toolObj.logoFile == ""){
    doDisplayImage = false;

  }

  if (obj.isIO) {
    if (obj.IOType === "Output") {
      return (
        <div
          className={`sandbox-node sandbox-node--device${selected ? " sandbox-node--selected" : ""}`}
          onDoubleClick={handleDoubleClick}
          onClick={handleClick}
        >
          <Handle
            className="target"
            type="target"
            id="input"
            position={Position.Left}
            isConnectable={isConnectable}

          />

          {doDisplayImage && <img
            className="logo-img"
            src={`${data.toolObj.logoFile}`}
            alt="/logosat.png"
          />}

          <h5> {localizedName(obj, lang)} </h5>
        </div>
      );
    }
    else if (obj.IOType === "Input") {
      return (
        <div
          className={`sandbox-node sandbox-node--device${selected ? " sandbox-node--selected" : ""}`}
          onDoubleClick={handleDoubleClick}
          onClick={handleClick}
        >

          {doDisplayImage && <img
            className="logo-img"
            src={`${data.toolObj.logoFile}`}
            alt="/logosat.png"
          />}

          <Handle
            className="source"
            type="source"
            id="output"
            position={Position.Right}
            isConnectable={isConnectable}
          />
          
          <h5> {localizedName(obj, lang)} </h5>
        </div>
      );
    }
  }

  return (
    <div
      className={`sandbox-node${obj.isIO ? " sandbox-node--device" : ""}${selected ? " sandbox-node--selected" : ""}`}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
    >
      <Handle
        className="target"
        type="target"
        id="input"
        position={Position.Left}
        isConnectable={isConnectable}
      />

      {doDisplayImage && <img className="logo-img" src={`${data.toolObj.logoFile}`} />}

      <Handle
        className="source"
        type="source"
        id="output"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <h5>{localizedName(data.toolObj, lang)}</h5>
    </div>
  );
});
