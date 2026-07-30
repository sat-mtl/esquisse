import React from "react";
import { useConnection, useNodes, useReactFlow } from "@xyflow/react";
import { canConnect } from "../ToolObjects.js";

function getOutputHandlePosition(internalNode) {
  const bounds = internalNode?.internals.handleBounds?.source?.[0];
  if (!bounds) return null;
  return {
    x: internalNode.internals.positionAbsolute.x + bounds.x + bounds.width / 2,
    y: internalNode.internals.positionAbsolute.y + bounds.y + bounds.height / 2,
  };
}

export default ({ fromX, fromY, toX, toY, fromNode, toNode, failReasonRef }) => {
  const { fromHandle, toHandle } = useConnection();
  const { getInternalNode } = useReactFlow();
  const nodes = useNodes();

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

  const primaryValid = !toNode
    ? true
    : sameTypeHandles
      ? false
      : canConnect(outputNode?.data.toolObj, inputNode?.data.toolObj);

  /* isValidConnection (App.js) never runs for same-type pairs — React Flow's
   * own strict-mode type check short-circuits before our callback fires — so
   * this is the only place that can flag "direction" as the failure reason. */
  if (failReasonRef) {
    failReasonRef.current = !primaryValid && toNode ? (sameTypeHandles ? "direction" : "protocol") : null;
  }

  /* Multi-connect preview: every other currently-selected node fans out
   * alongside the actual drag, mirroring the sourceNodes logic in App.js's
   * onConnect. These always connect as output->input, regardless of which
   * handle the primary drag started from. */
  const otherSelected = nodes.filter(
    (n) => n.selected && n.id !== fromNode.id && n.id !== toNode?.id
  );

  const extraLines = otherSelected
    .map((node) => {
      const pos = getOutputHandlePosition(getInternalNode(node.id));
      if (!pos) return null;
      // Use the same direction-corrected target as the primary line — when
      // the primary drag started from an input handle, the real eventual
      // target is fromNode, not toNode.
      const isValid = !toNode
        ? true
        : sameTypeHandles
          ? false
          : canConnect(node.data.toolObj, inputNode?.data.toolObj);
      return { x: pos.x, y: pos.y, isValid };
    })
    .filter(Boolean);

  const lines = [{ x: fromX, y: fromY, isValid: primaryValid }, ...extraLines];
  const size = 4; // size of X arms

  return (
    <g>
      {lines.map(({ x, y, isValid }, i) => (
        <path
          key={i}
          fill="none"
          stroke={isValid ? "var(--xy-connectionline-stroke-default, #b1b1b7)" : "red"}
          strokeWidth={2}
          className="connection-line-path"
          d={`M${x},${y} C ${x} ${toY} ${x} ${toY} ${toX},${toY}`}
        />
      ))}

      {/* End marker reflects the primary drag's validity */}
      {primaryValid ? (
        <circle
          cx={toX}
          cy={toY}
          fill="#fff"
          r={3}
          stroke="var(--xy-connectionline-stroke-default, #b1b1b7)"
          strokeWidth={1.5}
        />
      ) : (
        <>
          <line x1={toX - size} y1={toY - size} x2={toX + size} y2={toY + size} stroke="red" strokeWidth={1} />
          <line x1={toX - size} y1={toY + size} x2={toX + size} y2={toY - size} stroke="red" strokeWidth={1} />
        </>
      )}
    </g>
  );
};
