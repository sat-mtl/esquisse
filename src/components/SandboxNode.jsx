
import { useDnD } from "../DnDContext.jsx";

import React, { memo } from "react";
import { Handle, Position } from "reactflow";

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

    if (data.toolObj == null){ //check for broken reference
        return(
            <>
                <p>There is an error dsplaying this node.</p>
                <p>No toolObj passed as input</p>
            </>
        )
    }


    let obj = data.toolObj;

            
    return (
        <>
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
                onConnect={(params) => console.log("handle onConnect", params)}
            />
            
            <p>sandboxNode</p>
            <p> {obj.name} </p>
            <img className="image" src={`/${data.toolObj.logoFile}`} alt="/logosat.png" /> 

            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
            />
        </>
    );

});