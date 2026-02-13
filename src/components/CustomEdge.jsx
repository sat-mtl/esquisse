import React from "react";

import {
  getBezierPath,
  EdgeLabelRenderer,
} from "@xyflow/react";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  data,
}) {
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        d={path}
        className="react-flow__edge-path"
        markerEnd={markerEnd}
        style={style}
      />

      {data?.sharedInput && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              background: "white",
              padding: "2px 6px",
              borderRadius: 6,
              fontSize: 12,
              pointerEvents: "none",
            }}
          >
            {data.sharedInput}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}