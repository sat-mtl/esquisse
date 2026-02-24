import { useDnD } from "../DnDContext.jsx";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";


/*
Sandbox nodes are nodes that take in a toolObj feild that contains information on
the details of an object. It is assumed that created nodes have a valid toolObj passed to them.
You can find the requirments of a toolObj at the top of ToolObjects.js

Sandbox nodes are meant to be used outside of the sidebar
*/

export default memo(({ data, isConnectable }) => {
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
  }

  let obj = data.toolObj;

  return (
    <div className="sandbox-node" onDoubleClick={handleDoubleClick}> 
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
      <p>{ obj.description }</p>

      <Handle
        className="source"
        type="source"
        id="#b1b1b7"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
  );
});
