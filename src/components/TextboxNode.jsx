import React, { useState, useEffect, useRef } from "react";
import { useReactFlow, NodeResizer } from "@xyflow/react";

export function TextboxNode({ id, data, selected }) {
  const { updateNodeData } = useReactFlow();
  const [text, setText] = useState(data.label || "");
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);

  /* - Uses local state for the textarea value to keep typing snappy and avoid
   *   triggering ReactFlow re-renders on every keystroke. */
  useEffect(() => {
    setText(data.label || "");
  }, [data.label]);

  useEffect(() => {
    if (isEditing) textareaRef.current?.focus();
  }, [isEditing]);

  const sharedStyle = {
    position: "absolute", // ← key fix
    top: 0, left: 0, right: 0, bottom: 0,
    width: "100%", height: "100%",
    boxSizing: "border-box",
    padding: "6px",
    border: "1px solid var(--color-border)",
    backgroundColor: data.color || "#fff",
    overflowWrap: "break-word",
    color: "var(--color-black)",
    lineHeight: 1.1,
    fontSize: `${data.fontSize ?? 12}px`,
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <NodeResizer minWidth={100} minHeight={50} isVisible={selected} />
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className="textbox"
          value={text}
          onChange={(e) => setText(e.target.value)}
          /* - Syncs to ReactFlow's node data only on blur (when you click away), so that
           *   the content is persisted when saving to localStorage or downloading as JSON. */
          onBlur={() => {
            updateNodeData(id, { label: text });
            setIsEditing(false);
          }}
          placeholder="Type text here"
          style={{ ...sharedStyle, resize: "none", overflowX: "hidden", overflowY: "auto" }}
        />
      ) : (
        /* Single click selects the node (handled by React Flow itself); only a
         * double click enters text-editing. Otherwise the textarea would grab
         * focus on every click, silently blocking delete/copy/paste shortcuts
         * (which intentionally skip while a textarea is focused, to not
         * hijack normal typing / text-selection copy). */
        <div
          className="textbox"
          onDoubleClick={() => setIsEditing(true)}
          style={{ ...sharedStyle, whiteSpace: "pre-wrap", overflowX: "hidden", overflowY: "auto", cursor: "text" }}
        >
          {text || <span className="textbox-placeholder">Type text here</span>}
        </div>
      )}
    </div>
  );
}
