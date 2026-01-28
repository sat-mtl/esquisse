import React, { memo } from "react";
import { Handle, Position } from "reactflow";

export default memo(({ data, isConnectable }) => {
    return (
        <>
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
                onConnect={(params) => console.log("handle onConnect", params)}
            />
            <div
                style={{
                    height: data.image.height,
                    width: data.image.width,
                    backgroundImage: `url(${data.image.src})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain"
                }}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
            />
        </>
    );
});
