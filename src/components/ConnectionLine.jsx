import React from "react";
import { useConnection } from "@xyflow/react";
import { canConnect } from "../ToolObjects.js";

export default ({ fromX, fromY, toX, toY, fromNode, toNode, failReasonRef }) => {
  const { fromHandle, toHandle } = useConnection();

  // Same-type pairing (inlet-to-inlet or outlet-to-outlet) is always invalid,
  // regardless of protocol overlap.
  const sameTypeHandles = toHandle && toHandle.type === fromHandle.type;

  /* React Flow normalizes the eventual connection's source/target by handle
   * type, not by drag direction: starting from a "target" (input) handle and
   * ending on a "source" (output) handle still produces an output->input
   * edge under the hood. Mirror that here so the preview matches reality. */
  const draggingFromInput = fromHandle.type === "target";
  const outputNode = draggingFromInput ? toNode : fromNode;
  const inputNode = draggingFromInput ? fromNode : toNode;

  const isValid = !toNode
    ? true
    : sameTypeHandles
      ? false
      : canConnect(outputNode?.data.toolObj, inputNode?.data.toolObj);

  /* isValidConnection (App.js) never runs for same-type pairs — React Flow's
   * own strict-mode type check short-circuits before our callback fires — so
   * this is the only place that can flag "direction" as the failure reason. */
  if (failReasonRef) {
    failReasonRef.current = !isValid && toNode ? (sameTypeHandles ? "direction" : "protocol") : null;
  }

  const strokeColor = isValid ? "var(--xy-connectionline-stroke-default, #b1b1b7)" : "red";
  const size = 4; // size of X arms

  return (
    <g>
      <path
        fill="none"
        stroke={strokeColor}
        strokeWidth={2}
        className="connection-line-path"
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
