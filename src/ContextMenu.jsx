import React, { use, useCallback } from "react";
import { useReactFlow } from "reactflow";

export default function ContextMenu({
    id,
    top,
    left,
    right,
    bottom,
    duplicateNode,
    ...props
}) {
    const { setNodes, setEdges } = useReactFlow();

    const deleteNode = useCallback(() => {
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
        setEdges((edges) => edges.filter((edge) => edge.source !== id));
    }, [id, setNodes, setEdges]);

    return (
        <div
            className="context-menu"
            style={{ top, left, right, bottom }}
            {...props}
        >
            <div onClick={() => duplicateNode(id)}>Duplicate Node</div>
            <div onClick={deleteNode}>Delete Node</div>
        </div>
    );
}
