import { useDnD } from "../DnDContext.jsx";

import React, { memo, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { useSelectionContext } from "../SelectionContext.jsx";

/*
Sandbox nodes are nodes that take in a toolObj feild that contains information on
the details of an object. It is assumed that created nodes have a valid toolObj passed to them.
You can find the requirments of a toolObj at the top of ToolObjects.js

Sandbox nodes are meant to be used outside of the sidebar
*/

export default memo(({ data, isConnectable }) => {
  //get context info
  const [selectedNode, setSelectedNode, hoveredNode, setHoveredNode] =
    useSelectionContext();

  //debug
  //console.log("Object in SandboxNode")
  //console.log(data.toolObj);

  if (data.toolObj == null) {
    //check for broken reference
    return (
      <>
        <p>There is an error displaying this node.</p>
        <p>No toolObj passed as input</p>
      </>
    );
  }

  const handleDoubleClick = () => {
    window.open(`${data.toolObj.docLink}`, "_blank");
  };

  //update selected obj on click
  const handleClick = useCallback(() => {
    console.log("this is a test");
    console.log(data);
    if (!data?.toolObj) {
      setSelectedNode(null);
      return;
    }
    const nodeToSelect = { id: data.id, ...data.toolObj };
    setSelectedNode(nodeToSelect);
  }, [setSelectedNode, data?.id, data?.toolObj]);
  let obj = data.toolObj;

  if (obj.isIO) {
    if (obj.IOType === "Output") {
      return (
        <div
          className="sandbox-node"
          onDoubleClick={handleDoubleClick}
          onClick={handleClick}
        >
          <Handle
            className="target"
            type="target"
            id="#b1b1b7"
            position={Position.Left}
            isConnectable={isConnectable}
            onConnect={(params) => console.log("handle onConnect", params)}
          />

          <img
            id="logo-img"
            src={`/${data.toolObj.logoFile}`}
            alt="/logosat.png"
          />
          <h5> {obj.name} </h5>
        </div>
      );
    }
    else if (obj.IOType === "Input") {
      return (
        <div
          className="sandbox-node"
          onDoubleClick={handleDoubleClick}
          onClick={handleClick}
        >

          <img
            id="logo-img"
            src={`/${data.toolObj.logoFile}`}
            alt="/logosat.png"
          />
          
          <Handle
            className="source"
            type="source"
            id="#b1b1b7"
            position={Position.Right}
            isConnectable={isConnectable}
          />
          
          <h5> {obj.name} </h5>
        </div>
      );
    }
  }

  return (
    <div
      className="sandbox-node"
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
    >
      <Handle
        className="target"
        type="target"
        id="#b1b1b7"
        position={Position.Left}
        isConnectable={isConnectable}
        onConnect={(params) => console.log("handle onConnect", params)}
      />

      <img id="logo-img" src={`/${data.toolObj.logoFile}`} />

      <Handle
        className="source"
        type="source"
        id="#b1b1b7"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <h5>{data.toolObj.name}</h5>
    </div>
  );
});
