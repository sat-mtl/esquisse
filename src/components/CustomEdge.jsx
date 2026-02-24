import React from "react";

import {
  getBezierPath,
  EdgeLabelRenderer,
  useReactFlow,
} from "@xyflow/react";

import { Dropdown } from "./Dropdown.jsx";

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

  const { setEdges } = useReactFlow();

  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const handleChange = (value) => {
        setEdges((edges) => 
          edges.map((edge) =>
            edge.id === id 
              ? {...edge, data: {...edge.data, protocol: value}}
              : edge
          )
    )
  }

  return (
    <>
      <path
        id={id}
        d={path}
        className="react-flow__edge-path"
        markerEnd={markerEnd}
        style={style}
      />

      
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
          >
            <Dropdown
              options={data?.sharedInput || []}
              value={data?.protocol}
              onChange={handleChange}
            />
          </div>
        </EdgeLabelRenderer>
      
    </>
  );
}