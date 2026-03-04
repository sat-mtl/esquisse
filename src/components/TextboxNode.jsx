import React, { useState, useEffect } from "react";
import { useReactFlow, NodeResizer } from "@xyflow/react";

export function TextboxNode({ id, data, selected }) {
  const { updateNodeData } = useReactFlow();
  const [text, setText] = useState(data.label || "");

  /* - Uses local state for the textarea value to keep typing snappy and avoid
   *   triggering ReactFlow re-renders on every keystroke. */
  useEffect(() => {
    setText(data.label || "");
  }, [data.label]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <NodeResizer minWidth={100} minHeight={50} isVisible={selected} />
      <textarea
        className="textbox"
        value={text}
        onChange={(e) => setText(e.target.value)}
        /* - Syncs to ReactFlow's node data only on blur (when you click away), so that
         *   the content is persisted when saving to localStorage or downloading as JSON. */
        onBlur={() => updateNodeData(id, { label: text })}
        placeholder="Type text here"
        style={{
          position: "absolute",  // ← key fix
          top: 0, left: 0, right: 0, bottom: 0,
          width: "100%", height: "100%",
          boxSizing: "border-box",
          resize: "none",
        }}
      />
    </div>
  );
}