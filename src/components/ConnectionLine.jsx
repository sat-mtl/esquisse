import React from "react";
import { useConnection } from "@xyflow/react";
import { canConnect } from "../ToolObjects.js";

export default ({ fromX, fromY, toX, toY, fromNode, toNode }) => {
  const { fromHandle } = useConnection();

  const isValid = toNode
    ? canConnect(fromNode.data.toolObj, toNode.data.toolObj)
    : true;

  const strokeColor = isValid ? fromHandle.id : "red";
  const size = 4; // size of X arms

  return (
    <g>
      <path
        fill="none"
        stroke={strokeColor}
        strokeWidth={1}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />

      {/* End marker is a circle if it's valid */}
      {isValid ? (
        <circle
          cx={toX}
          cy={toY}
          fill="#fff"
          r={3}
          stroke={strokeColor}
          strokeWidth={1.5}
        />
      ) : (
        <>
          {/* End marker is an x if it's invalid */}
          <line
            x1={toX - size}
            y1={toY - size}
            x2={toX + size}
            y2={toY + size}
            stroke="red"
            strokeWidth={1}
          />
          <line
            x1={toX - size}
            y1={toY + size}
            x2={toX + size}
            y2={toY - size}
            stroke="red"
            strokeWidth={1}
          />
        </>
      )}
    </g>
  );
};
