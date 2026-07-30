import React from "react";
import { useConnection, useNodes, useReactFlow } from "@xyflow/react";
import { canConnect } from "../ToolObjects.js";

function getHandlePosition(internalNode, handleType) {
  const bounds = internalNode?.internals.handleBounds?.[handleType]?.[0];
  if (!bounds) return null;
  return {
    x: internalNode.internals.positionAbsolute.x + bounds.x + bounds.width / 2,
    y: internalNode.internals.positionAbsolute.y + bounds.y + bounds.height / 2,
  };
}

// DOM-based lookup (mirrors the box-select-cable hit-test elsewhere in this
// app): internals.handleBounds isn't reliably populated for every node during
// a reconnect drag, but the rendered handle element always is.
function getHandleFlowPosition(screenToFlowPosition, nodeId, handleId) {
  const handleEl = document.querySelector(
    `.react-flow__handle[data-nodeid="${nodeId}"][data-handleid="${handleId}"]`
  );
  if (!handleEl) return null;
  const rect = handleEl.getBoundingClientRect();
  return screenToFlowPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
}

export default ({ fromX, fromY, toX, toY, fromNode, toNode, failReasonRef, reconnectPreviewRef }) => {
  const { fromHandle, toHandle } = useConnection();
  const { getInternalNode, screenToFlowPosition } = useReactFlow();
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

  /* Multi-connect preview, mirroring App.js's onConnect: whichever role
   * (source or target) the literal dragged node belongs to, if THAT node is
   * itself selected, the whole selected group shares that role — never both
   * sides fanning out at once (that would suggest connections between the
   * selected nodes themselves, which never actually happen). */
  const outputNodeSelected = !!outputNode?.selected;
  const inputNodeSelected = !outputNodeSelected && !!inputNode?.selected;

  const otherSelected = nodes.filter(
    (n) => n.selected && n.id !== fromNode.id && n.id !== toNode?.id
  );

  /* Multi-cable reconnect preview: onReconnectStart (App.js) hands us the
   * exact set of other selected edges. Each one's line is anchored at its
   * own current (pre-drag) endpoint — not its far-off fixed node — so the
   * preview reads as "this cable is moving to the cursor" rather than a
   * confusing line jumping across the whole canvas. */
  const reconnectInfo = reconnectPreviewRef?.current;

  let extraLines = [];
  if (reconnectInfo) {
    extraLines = reconnectInfo.edges
      .map(({ fixedNodeId, oldMovingNodeId }) => {
        const fixedNode = nodes.find((n) => n.id === fixedNodeId);
        if (!fixedNode) return null;
        const oldHandleId = reconnectInfo.movingSide === "target" ? "input" : "output";
        const pos = getHandleFlowPosition(screenToFlowPosition, oldMovingNodeId, oldHandleId);
        if (!pos) return null;
        const isValid = !toNode
          ? true
          : sameTypeHandles
            ? false
            : reconnectInfo.fixedSide === "source"
              ? canConnect(fixedNode.data.toolObj, toNode.data.toolObj)
              : canConnect(toNode.data.toolObj, fixedNode.data.toolObj);
        return { fromPos: pos, toPos: { x: toX, y: toY }, isValid };
      })
      .filter(Boolean);
  } else if (outputNodeSelected) {
    // Other selected nodes are additional sources, fanning into the live cursor.
    extraLines = otherSelected
      .map((node) => {
        const pos = getHandlePosition(getInternalNode(node.id), "source");
        if (!pos) return null;
        const isValid = !toNode
          ? true
          : sameTypeHandles
            ? false
            : canConnect(node.data.toolObj, inputNode?.data.toolObj);
        return { fromPos: pos, toPos: { x: toX, y: toY }, isValid };
      })
      .filter(Boolean);
  } else if (inputNodeSelected) {
    // Other selected nodes are additional targets, fed from the live cursor
    // (which represents the single external source in this scenario).
    extraLines = otherSelected
      .map((node) => {
        const pos = getHandlePosition(getInternalNode(node.id), "target");
        if (!pos) return null;
        const isValid = !toNode
          ? true
          : sameTypeHandles
            ? false
            : canConnect(outputNode?.data.toolObj, node.data.toolObj);
        return { fromPos: { x: toX, y: toY }, toPos: pos, isValid };
      })
      .filter(Boolean);
  }

  const lines = [
    { fromPos: { x: fromX, y: fromY }, toPos: { x: toX, y: toY }, isValid: primaryValid },
    ...extraLines,
  ];
  const size = 4; // size of X arms

  return (
    <g>
      {lines.map(({ fromPos, toPos, isValid }, i) => (
        <path
          key={i}
          fill="none"
          stroke={isValid ? "var(--xy-connectionline-stroke-default, #b1b1b7)" : "red"}
          strokeWidth={2}
          className="connection-line-path"
          d={`M${fromPos.x},${fromPos.y} C ${fromPos.x} ${toPos.y} ${fromPos.x} ${toPos.y} ${toPos.x},${toPos.y}`}
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
