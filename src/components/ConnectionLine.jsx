import React from "react";
import { useConnection } from "@xyflow/react";
import { canConnect } from "../ToolObjects.js";

export default ({ fromX, fromY, toX, toY, fromNode, toNode }) => {
  const { fromHandle } = useConnection();

  const isValid = toNode
    ? canConnect(fromNode.data.toolObj, toNode.data.toolObj)
    : true; // allow dragging to empty space

  return (
    <g>
      <path
        fill="none"
        stroke={isValid ? fromHandle.id : "red"}
        strokeWidth={1}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke={fromHandle.id}
        strokeWidth={1.5}
      />
    </g>
  );
};
