
import { useDnD } from "../DnDContext.jsx";
import "../ToolObjects.js";

import React, { memo } from "react";
import { Handle, Position } from "reactflow";





export default memo(({ data, isConnectable }) => {

    //debug mode
    //console.log("Object in SandboxNode")
    //console.log(data.toolObj);

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