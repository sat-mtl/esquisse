import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  MarkerType,
  useReactFlow,
  useStoreApi,
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  SelectionMode,
  reconnectEdge,
  getBezierPath,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";


import Sidebar from "./Sidebar.jsx";


//contexts

//contexts
import { FlowContextProvider, useFlowContext } from "./FlowContext.jsx";
import { DnDProvider, useDnD } from "./DnDContext.jsx";
import { SelectionContextProvider, useSelectionContext } from "./SelectionContext.jsx";

import { TopMenuBar } from "./components/TopMenuBar.jsx";
import { TapAddProvider, useTapAdd } from "./TapAddContext.jsx";

import SandboxNode from './components/SandboxNode.jsx';
import { TextboxNode } from "./components/TextboxNode.jsx";
import Landing from './components/Landing.jsx';
import ContextMenu from './ContextMenu.jsx';
import * as tools from "./ToolObjects.js";
import ConnectionLine from './components/ConnectionLine.jsx'; 
import CustomEdge from "./components/CustomEdge.jsx";
import { validateTemplate } from "./Templates.js";
import { CustomNodeEditModal } from "./components/CustomNodeLogic.jsx";
import { useLang, localizedName } from "./LangContext.jsx";


let id = 0;
const getId = () => `${id++}`;

const nodeTypes = {
  sandbox: SandboxNode,
  custSandbox: SandboxNode,
  custDevice: SandboxNode,
  textbox: TextboxNode,
};

const edgeTypes = {
  custom: CustomEdge
}

const addEndMarker = (edge) => ({
  ...edge,
  markerEnd: {
    type: MarkerType.Arrow,
  },
});

const flowKey = 'saved-flow';

// Comment box color palette — null = default (white). Derived from
// --color-blue and the app's existing greys, not generic sticky-note pastels.
const COMMENT_COLORS = [null, "#c7c7d1", "#a9c2f7", "#c7bdf7"];

const Flow = () => {
  const reactFlowWrapper = useRef(null);

  const { screenToFlowPosition, deleteElements, getNodes, getInternalNode } = useReactFlow();
  const store = useStoreApi();
  const [nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange, snapshot, undo, redo, initHistory] = useFlowContext();
  const [menu, setMenu] = useState({ type: null, data: {} });
  
  const ref = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport, fitView } = useReactFlow();

  const [type, setType, obj, setObj] = useDnD();
  const tapAddRef = useTapAdd();

  const [flowName, setFlowName] = useState("");
  const [flowDescription, setFlowDescription] = useState("");
  const [selectedNode, setSelectedNode, hoveredNode, setHoveredNode, isShowModal,
    setIsShowModal, custDropInfo, setCustDropInfo] = useSelectionContext();

  const { t, lang } = useLang();

  const [connectToast, setConnectToast] = useState(null);
  const connectSourceRef = useRef(null);
  const connectCompletedRef = useRef(false);
  const toastTimerRef = useRef(null);
  const connectFailReasonRef = useRef(null);
  const clipboardRef = useRef({ nodes: [], edges: [] });
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const ConnectionLineWithReason = useCallback(
    (props) => <ConnectionLine {...props} failReasonRef={connectFailReasonRef} />,
    [],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Prevent the browser from navigating when a drag ends outside the canvas
  useEffect(() => {
    const blockDrop = (e) => e.preventDefault();
    document.addEventListener("dragover", blockDrop);
    document.addEventListener("drop", blockDrop);
    return () => {
      document.removeEventListener("dragover", blockDrop);
      document.removeEventListener("drop", blockDrop);
    };
  }, []);

  // Tracks the cursor so Ctrl/Cmd+V has somewhere to paste
  useEffect(() => {
    const handler = (e) => { lastMousePosRef.current = { x: e.clientX, y: e.clientY }; };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  const copyNode = useCallback(
    (id = null) => {
      // Collect all selected nodes; fall back to the right-clicked node
      const selected = nodes.filter(n => n.selected);
      const toCopy = selected.length > 0 ? selected : (id ? nodes.filter(n => n.id === id) : []);
      if (!toCopy.length) return;

      // Also copy edges between two copied nodes, so a connected group pastes intact
      const copiedIds = new Set(toCopy.map(n => n.id));
      const copiedEdges = edges.filter(e => copiedIds.has(e.source) && copiedIds.has(e.target));

      clipboardRef.current = {
        nodes: toCopy.map(node => ({ ...node, data: { ...node.data } })),
        edges: copiedEdges.map(edge => ({ ...edge, data: { ...edge.data } })),
      };
      setMenu({ type: null, data: null });
    },
    [nodes, edges, setMenu],
  );

  const pasteNodes = useCallback(
    (flowPosition) => {
      const { nodes: clipNodes, edges: clipEdges } = clipboardRef.current;
      if (!clipNodes.length) return;

      // Anchor the pasted group so its bounding-box center lands at flowPosition,
      // preserving relative offsets between multiple copied nodes.
      const centerX = clipNodes.reduce((sum, n) => sum + n.position.x, 0) / clipNodes.length;
      const centerY = clipNodes.reduce((sum, n) => sum + n.position.y, 0) / clipNodes.length;

      snapshot(nodes, edges);
      const timestamp = Date.now();
      const idMap = new Map();
      const newNodes = clipNodes.map((node, i) => {
        const newId = `paste_${timestamp}_${i}`;
        idMap.set(node.id, newId);
        return {
          ...node,
          id: newId,
          position: {
            x: node.position.x - centerX + flowPosition.x,
            y: node.position.y - centerY + flowPosition.y,
          },
          selected: false,
        };
      });
      const newEdges = clipEdges.map((edge, i) => ({
        ...edge,
        id: `paste_edge_${timestamp}_${i}`,
        source: idMap.get(edge.source),
        target: idMap.get(edge.target),
        selected: false,
      }));

      setNodes(nds => nds.concat(newNodes));
      if (newEdges.length) setEdges(eds => eds.concat(newEdges));
      setMenu({ type: null, data: null });
    },
    [nodes, edges, snapshot, setNodes, setEdges, setMenu],
  );

  // Cmd/Ctrl +/- resizes selected comment(s)' text; returns false (and lets
  // the browser's native page-zoom happen instead) if no comment is selected.
  const resizeCommentFont = useCallback((delta) => {
    const selectedIds = new Set(nodes.filter(n => n.selected && n.type === "textbox").map(n => n.id));
    if (!selectedIds.size) return false;

    snapshot(nodes, edges);
    setNodes(nds => nds.map(n => {
      if (!selectedIds.has(n.id)) return n;
      const current = n.data.fontSize ?? 12;
      const next = Math.min(48, Math.max(6, current + delta));
      return { ...n, data: { ...n.data, fontSize: next } };
    }));
    return true;
  }, [nodes, edges, snapshot, setNodes]);

  /* Box-select only ever selects an edge as a side effect of its connected
   * NODES being touched by the drag rectangle (React Flow's own behavior) —
   * it never tests the cable's own path/label. This adds that: any edge
   * whose midpoint falls inside the live selection rectangle also gets
   * selected, on top of React Flow's node-based selection. */
  useEffect(() => {
    const unsubscribe = store.subscribe((state, prevState) => {
      if (state.userSelectionRect === prevState.userSelectionRect) return;
      const rect = state.userSelectionRect;
      if (!rect) return;

      const from = screenToFlowPosition({ x: rect.x, y: rect.y });
      const to = screenToFlowPosition({ x: rect.x + rect.width, y: rect.y + rect.height });
      const minX = Math.min(from.x, to.x), maxX = Math.max(from.x, to.x);
      const minY = Math.min(from.y, to.y), maxY = Math.max(from.y, to.y);

      const nodeById = new Map(getNodes().map(n => [n.id, n]));

      setEdges((eds) => eds.map((edge) => {
        const sourceNode = nodeById.get(edge.source);
        const targetNode = nodeById.get(edge.target);
        if (!sourceNode || !targetNode) return edge;

        const sourceInternal = getInternalNode(edge.source);
        const targetInternal = getInternalNode(edge.target);
        const sourceHandle = sourceInternal?.internals.handleBounds?.source?.[0];
        const targetHandle = targetInternal?.internals.handleBounds?.target?.[0];

        const nodeBasedSelected = !!(sourceNode.selected || targetNode.selected);
        if (!sourceHandle || !targetHandle) {
          return edge.selected === nodeBasedSelected ? edge : { ...edge, selected: nodeBasedSelected };
        }

        const sourceX = sourceInternal.internals.positionAbsolute.x + sourceHandle.x + sourceHandle.width / 2;
        const sourceY = sourceInternal.internals.positionAbsolute.y + sourceHandle.y + sourceHandle.height / 2;
        const targetX = targetInternal.internals.positionAbsolute.x + targetHandle.x + targetHandle.width / 2;
        const targetY = targetInternal.internals.positionAbsolute.y + targetHandle.y + targetHandle.height / 2;

        const [, labelX, labelY] = getBezierPath({
          sourceX, sourceY, targetX, targetY,
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        });

        const inBox = labelX >= minX && labelX <= maxX && labelY >= minY && labelY <= maxY;
        const nextSelected = inBox || nodeBasedSelected;

        return edge.selected === nextSelected ? edge : { ...edge, selected: nextSelected };
      }));
    });
    return unsubscribe;
  }, [store, screenToFlowPosition, getNodes, getInternalNode, setEdges]);

  // Undo/redo + delete keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      // Skip if user is typing in an input/textarea
      if (e.target.closest("input, textarea, [contenteditable]")) return;

      const mod = e.metaKey || e.ctrlKey;
      if (mod) {
        if (e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(nodes, edges); return; }
        if ((e.key === "z" && e.shiftKey) || e.key === "y") { e.preventDefault(); redo(nodes, edges); return; }
        if (e.key === "c") { e.preventDefault(); copyNode(); return; }
        if (e.key === "v") {
          e.preventDefault();
          pasteNodes(screenToFlowPosition(lastMousePosRef.current));
          return;
        }
      }

      if (e.key === "Backspace" || e.key === "Delete") {
        const selectedNodes = nodes.filter(n => n.selected);
        const selectedEdges = edges.filter(ed => ed.selected);
        if (!selectedNodes.length && !selectedEdges.length) return;
        e.preventDefault();
        snapshot(nodes, edges);
        deleteElements({ nodes: selectedNodes, edges: selectedEdges });
      }

      // connectOnClick has no built-in way to cancel a started click-connection
      if (e.key === "Escape") {
        store.setState({ connectionClickStartHandle: null });
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [undo, redo, nodes, edges, snapshot, deleteElements, copyNode, pasteNodes, screenToFlowPosition, store]);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();


      // check if the dropped element is valid
      if (!type) {
        return;
      }

    // project was renamed to screenToFlowPosition
    // and you don't need to subtract the reactFlowBounds.left/top anymore
    // details: https://reactflow.dev/whats-new/2023-11-10
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

    if(type === "composite" && obj){

      //Validate template
      if(!validateTemplate(obj)){
        alert(t.templateInvalid);
        return;
      }

      snapshot(nodes, edges);
      const timestamp = Date.now();

      const newNodes = obj.nodes.map(n => ({
        ...n,
        id:`${n.id}-${timestamp}`,
        type: "sandbox",
        data: {toolObj: n.data?.toolObj},
        position: {x: n.position.x + position.x, y: n.position.y + position.y},
      }));

      const newEdges = obj.edges.map(e => {
        const sourceNode = newNodes.find(n => n.id.startsWith(e.source));
        const targetNode = newNodes.find(n => n.id.startsWith(e.target));

        const sharedInput = 
        e.data?.sharedInput ||
        tools.getMatchingIO(
          sourceNode.data.toolObj,
          targetNode.data.toolObj
        );

        const protocol = e.data?.protocol || (sharedInput.length ? sharedInput[0] : "");

        return{
          ...e,
          id: `${e.id}-${timestamp}`,
          source: `${e.source}-${timestamp}`,
          target: `${e.target}-${timestamp}`,
          type: "custom",
          data: {sharedInput, protocol},
        };
      });

      setNodes(nds => nds.concat(newNodes));
      setEdges(eds => eds.concat(newEdges));
      if (nodes.length === 0) {
        if (obj.name) setFlowName(obj.name);
        if (obj.description) setFlowDescription(obj.description);
      }
      return;
    }
    
    if(type == "custSandbox"){
      setCustDropInfo([position, getId()]);
      setIsShowModal("tool");
    } else if (type == "custDevice") {
      setCustDropInfo([position, getId()]);
      setIsShowModal("device");

    } else {
      
      //If creating a sandbox node, check that there is a valid toolObj to pass to it.
      if(type == 'sandbox' && !tools.checkValid(obj)){ 
        throw "Invalid toolObj: " + obj.name;
      }

      const newNode = {
        id: "dndNode_" + getId(),
        type,
        position,
        data: { 
          label: `${type} node`,
          ...(type === 'sandbox' && {toolObj: obj}),
        },
      };

        snapshot(nodes, edges);
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [screenToFlowPosition, type, obj, nodes, edges, snapshot], //end of useCallback, tells useCallback what to update to prevent staleClosures
  );

  const addNodeAtCenter = useCallback((nodeType, toolObj, template) => {
    const canvasEl = reactFlowWrapper.current;
    if (!canvasEl) return;
    const bounds = canvasEl.getBoundingClientRect();
    const position = screenToFlowPosition({
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
    });

    if (nodeType === "composite" && template) {
      if (!validateTemplate(template)) { alert(t.templateInvalid); return; }
      const timestamp = Date.now();
      const newNodes = template.nodes.map(n => ({
        ...n,
        id: `${n.id}-${timestamp}`,
        type: "sandbox",
        data: { toolObj: n.data?.toolObj },
        position: { x: n.position.x + position.x, y: n.position.y + position.y },
      }));
      const newEdges = template.edges.map(e => {
        const sourceNode = newNodes.find(n => n.id.startsWith(e.source));
        const targetNode = newNodes.find(n => n.id.startsWith(e.target));
        const sharedInput = e.data?.sharedInput || tools.getMatchingIO(sourceNode.data.toolObj, targetNode.data.toolObj);
        const protocol = e.data?.protocol || (sharedInput.length ? sharedInput[0] : "");
        return { ...e, id: `${e.id}-${timestamp}`, source: `${e.source}-${timestamp}`, target: `${e.target}-${timestamp}`, type: "custom", data: { sharedInput, protocol } };
      });
      setNodes(nds => nds.concat(newNodes));
      setEdges(eds => eds.concat(newEdges));
      if (nodes.length === 0) {
        if (template.name) setFlowName(template.name);
        if (template.description) setFlowDescription(template.description);
      }
      setTimeout(() => fitView({ padding: 0.2 }), 0);
      return;
    }

    if (nodeType === "sandbox" && !tools.checkValid(toolObj)) return;

    setNodes(nds => nds.concat({
      id: "dndNode_" + getId(),
      type: nodeType,
      position,
      data: { label: `${nodeType} node`, ...(nodeType === "sandbox" && { toolObj }) },
    }));
    setTimeout(() => fitView({ padding: 0.5, maxZoom: 0.75 }), 50);
  }, [screenToFlowPosition, setNodes, setEdges, setFlowName, setFlowDescription, fitView]);

  useEffect(() => {
    tapAddRef.current = addNodeAtCenter;
  }, [addNodeAtCenter]);

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectSourceRef.current = nodeId;
    connectCompletedRef.current = false;
  }, []);

  const onConnectEnd = useCallback(() => {
    if (!connectCompletedRef.current && connectSourceRef.current) {
      const sourceNode = nodes.find(n => n.id === connectSourceRef.current);
      if (sourceNode?.data?.toolObj) {
        const reason = connectFailReasonRef.current;
        let msg;
        if (reason === "direction") {
          msg = t.toastDirection;
        } else {
          const outputs = sourceNode.data.toolObj.output;
          msg = outputs?.length
            ? `${t.toastNoProtocol} — ${localizedName(sourceNode.data.toolObj, lang)}: ${outputs.join(", ")}`
            : t.toastNoProtocol;
        }
        setConnectToast(msg);
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setConnectToast(null), 4000);
      }
    }
    connectSourceRef.current = null;
    connectFailReasonRef.current = null;
  }, [nodes]);

  const onConnect = useCallback(
    (connection) => {
      connectCompletedRef.current = true;
      const targetNode = nodes.find(n => n.id === connection.target);
      if (!targetNode) return;

      // Multi-connect: the actually-dragged source, plus any other selected
      // nodes (Ctrl/Cmd-click to multi-select), all connect to the same target.
      const sourceNodes = nodes.filter(
        n => n.id !== targetNode.id && (n.id === connection.source || n.selected)
      );

      const newEdges = sourceNodes.reduce((eds, sourceNode) => {
        const sharedInput = tools.getMatchingIO(sourceNode.data.toolObj, targetNode.data.toolObj);
        if (!sharedInput) return eds;
        return addEdge(
          addEndMarker({
            source: sourceNode.id,
            sourceHandle: connection.sourceHandle,
            target: targetNode.id,
            targetHandle: connection.targetHandle,
            type: "custom",
            data: { sharedInput, protocol: "" },
          }),
          eds
        );
      }, edges);

      if (newEdges === edges) return;

      snapshot(nodes, edges);
      setEdges(newEdges);
    },
    [nodes, edges, setEdges, snapshot],
  );

  /* Auto-save whenever canvas content changes */
  useEffect(() => {
    if (!rfInstance) return;
    const flow = {
      ...rfInstance.toObject(),
      ...(flowName && { name: flowName }),
      ...(flowDescription && { description: flowDescription }),
    };
    localStorage.setItem(flowKey, JSON.stringify(flow));
  }, [nodes, edges, flowName, flowDescription]); // rfInstance intentionally omitted — accessed via closure, not a trigger
  
  /* Enables downloading the state of the flow diagram */
  const onDownload = useCallback(() => {
    if (!rfInstance) return;

    const flow = {
      ...rfInstance.toObject(),
      ...(flowName && { name: flowName }),
      ...(flowDescription && { description: flowDescription }),
    };
    const json = JSON.stringify(flow, null, 2);

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = flowName ? `${flowName.trim().replace(/\s+/g, "-").toLowerCase()}.json` : "esquisse-flow.json";
    a.click();

    URL.revokeObjectURL(url);
  }, [rfInstance, flowName, flowDescription]);
  
/* Dev feature for now: enables uploading JSON flows */
  const onUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      let flow;
      try { flow = JSON.parse(e.target.result); } catch { return; }
      
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport ?? {};
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setFlowName(flow.name || "");
        setFlowDescription(flow.description || "");
        initHistory(flow.nodes || [], flow.edges || []);
        if (flow.viewport) {
          setViewport({ x, y, zoom });
        } else {
          setTimeout(() => fitView({ padding: 0.2 }), 0);
        }
        
        /* Sync the ID counter with the uploaded file's counter to prevent nodes getting replaced: 
            Node ids are assigned in the following convention "dndnode_x", where x is the number on the id global variable.
            Since id may be 0 if you upload a json file, this lambda will check what the highest number of nodes is on the uploaded file 
            and set the global id counter to that.
           
            We use .replace with that weird regex to get through the entire string and just know what the number at the end is. 
        */
        const maxId = (flow.nodes || []).reduce((max, node) => {
          const num = parseInt(node.id.replace(/\D+/g, ""), 10);
          return isNaN(num) ? max : Math.max(max, num);
        }, -1);
        id = maxId + 1; 
        
      }
    };
    
    reader.readAsText(file);
  }, [setNodes, setEdges, setViewport, setFlowName, setFlowDescription, fitView, initHistory]);

  /* Restores the state of the flow diagram to whatever is saved in localStorage if it exists */
  const restoreFlow = useCallback(() => {
    let flow;
    try { flow = JSON.parse(localStorage.getItem(flowKey)); } catch { return; }
    
    if (flow) {
      const { x = 0, y = 0, zoom = 1 } = flow.viewport ?? {};
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      setViewport({ x, y, zoom });
      setFlowName(flow.name || "");
      setFlowDescription(flow.description || "");
      initHistory(flow.nodes || [], flow.edges || []);

      /* Sync the ID counter with the uploaded file's counter to prevent nodes getting replaced: 
          Node ids are assigned in the following convention "dndnode_x", where x is the number on the id global variable.
          Since id may be 0 if you upload a json file, this lambda will check what the highest number of nodes is on the uploaded file 
          and set the global id counter to that.
         
          We use .replace with that weird regex to get through the entire string and just know what the number at the end is. 
      */
      const maxId = (flow.nodes || []).reduce((max, node) => {
        const num = parseInt(node.id.replace(/\D+/g, ""), 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, -1);
      id = maxId + 1; 
    }
  }, [setNodes, setEdges, setViewport, initHistory]);
  

  const onNewFile = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setFlowName("");
    setFlowDescription("");
    initHistory([], []);
  }, [setNodes, setEdges, initHistory]);
  
  /* Controls toggling the landing page*/
  const [isLandingModalOpen, setLandingModalOpen] = useState(true);
  const onToggleLandingModal = useCallback(()=>{
    if(isLandingModalOpen){
      setLandingModalOpen(false);
    }else{
      setLandingModalOpen(true);
    }

  }, [isLandingModalOpen])


  
  /* Restores the state of the node diagram each time the page is reloaded */
  useEffect(() => {
    if (rfInstance) restoreFlow();
  }, [rfInstance]);

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate the position of the context menu, relative to the pane
      // (not the viewport), making sure it doesn't get positioned off-screen
      const pane = ref.current.getBoundingClientRect();
      const x = event.clientX - pane.left;
      const y = event.clientY - pane.top;
      setMenu({
        type: "node",
        data: {
          id: node.id,
          top: y < pane.height - 200 && y,
          left: x < pane.width - 200 && x,
          right: x >= pane.width - 200 && pane.width - x,
          bottom: y >= pane.height - 200 && pane.height - y,
        }
      });
    },
    [setMenu],
  );

  const onEdgeContextMenu = useCallback((event, edge) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate the position of the context menu, relative to the pane
      // (not the viewport), making sure it doesn't get positioned off-screen
      const pane = ref.current.getBoundingClientRect();
      const x = event.clientX - pane.left;
      const y = event.clientY - pane.top;
      setMenu({
        type: "edge",
        data: {
          id: edge.id,
          top: y < pane.height - 200 && y,
          left: x < pane.width - 200 && x,
          right: x >= pane.width - 200 && pane.width - x,
          bottom: y >= pane.height - 200 && pane.height - y,
        }
      });
    },
    [setMenu],
  )

  const onPaneContextMenu = useCallback((event) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate the position of the context menu, relative to the pane
      // (not the viewport), making sure it doesn't get positioned off-screen
      const pane = ref.current.getBoundingClientRect();
      const x = event.clientX - pane.left;
      const y = event.clientY - pane.top;
      setMenu({
        type: "pane",
        data: {
          top: y < pane.height - 200 && y,
          left: x < pane.width - 200 && x,
          right: x >= pane.width - 200 && pane.width - x,
          bottom: y >= pane.height - 200 && pane.height - y,
        }
      });
    },
    [],
  )

  // Close context menu and deselect node when canvas is clicked
  const onPaneclick = useCallback(() => {
    setMenu({ type: null, data: null });
    setSelectedNode(null);
  }, [setSelectedNode]);

  const bringToFront = useCallback((id) => {
    const selectedIds = new Set(nodes.filter(n => n.selected).map(n => n.id));
    if (!selectedIds.has(id)) selectedIds.add(id);
    snapshot(nodes, edges);
    // Edges/cables render with no explicit z-index of their own (default DOM
    // paint order puts them below nodes) — a node needs an explicit zIndex to
    // cross that layer boundary, not just array position among other nodes.
    setNodes(nds => [
      ...nds.filter(n => !selectedIds.has(n.id)),
      ...nds.filter(n => selectedIds.has(n.id)).map(n => ({ ...n, zIndex: 1000 })),
    ]);
    setMenu({ type: null, data: null });
  }, [nodes, edges, snapshot, setNodes, setMenu]);

  const sendToBack = useCallback((id) => {
    const selectedIds = new Set(nodes.filter(n => n.selected).map(n => n.id));
    if (!selectedIds.has(id)) selectedIds.add(id);
    snapshot(nodes, edges);
    setNodes(nds => [
      ...nds.filter(n => selectedIds.has(n.id)).map(n => ({ ...n, zIndex: -1 })),
      ...nds.filter(n => !selectedIds.has(n.id)),
    ]);
    setMenu({ type: null, data: null });
  }, [nodes, edges, snapshot, setNodes, setMenu]);

  const setNodeColor = useCallback((id, color) => {
    snapshot(nodes, edges);
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, color } } : n));
    setMenu({ type: null, data: null });
  }, [nodes, edges, snapshot, setNodes, setMenu]);

  const deleteNode = useCallback((id) => {
        const selectedIds = new Set(nodes.filter(n => n.selected).map(n => n.id));
        if (!selectedIds.has(id)) selectedIds.add(id); // always include right-clicked node
        snapshot(nodes, edges);
        deleteElements({ nodes: [...selectedIds].map(nid => ({ id: nid })) });
        setMenu({ type: null, data: null });
    }, [nodes, edges, snapshot, deleteElements, setMenu]
  );

  const deleteEdge = useCallback((id) => {
    snapshot(nodes, edges);
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
    setMenu({ type: null, data: null });
  }, [nodes, edges, snapshot, setEdges]);

  // Drag an existing edge's endpoint onto empty canvas to delete it
  const edgeReconnectSuccessfulRef = useRef(true);

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessfulRef.current = false;
  }, []);

  const onReconnect = useCallback((oldEdge, newConnection) => {
    edgeReconnectSuccessfulRef.current = true;
    snapshot(nodes, edges);
    setEdges(eds => {
      // Dragging onto a pair that's already connected would create a
      // duplicate edge — just drop the old one instead.
      const isDuplicate = eds.some(
        e => e.id !== oldEdge.id && e.source === newConnection.source && e.target === newConnection.target
      );
      if (isDuplicate) {
        return eds.filter(e => e.id !== oldEdge.id);
      }

      // Recompute shared protocols for the new pair — reconnectEdge alone
      // keeps the old edge's data, which would be stale for the new endpoint.
      const sourceNode = nodes.find(n => n.id === newConnection.source);
      const targetNode = nodes.find(n => n.id === newConnection.target);
      const sharedInput = sourceNode && targetNode
        ? tools.getMatchingIO(sourceNode.data.toolObj, targetNode.data.toolObj)
        : null;

      return reconnectEdge(
        { ...oldEdge, data: { sharedInput, protocol: "" } },
        newConnection,
        eds
      );
    });
  }, [nodes, edges, snapshot, setEdges]);

  const onReconnectEnd = useCallback((_, edge) => {
    if (!edgeReconnectSuccessfulRef.current) {
      snapshot(nodes, edges);
      setEdges(eds => eds.filter(e => e.id !== edge.id));
    }
    edgeReconnectSuccessfulRef.current = true;
  }, [nodes, edges, snapshot, setEdges]);

  return (
    <div className="dndflow">
      {isLandingModalOpen && <Landing onButtonClick={onToggleLandingModal}/>}
      {isShowModal && <CustomNodeEditModal/>}

      <div className="dndflow-left">
      <TopMenuBar
        onDownload={onDownload}
        onUpload={onUpload}
        onInstructions={onToggleLandingModal}
        onNewFile={onNewFile}
        flowName={flowName}
        setFlowName={setFlowName}
        flowDescription={flowDescription}
        setFlowDescription={setFlowDescription}
        hasNodes={nodes.length > 0}
      />

      <div className="dndflow-canvas-area">
      <div
        className="reactflow-wrapper"
        ref={reactFlowWrapper}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          edgeTypes={edgeTypes}
          ref={ref}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onReconnect={onReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setRfInstance}
          connectionLineComponent={ConnectionLineWithReason}
          onNodeContextMenu={onNodeContextMenu}
          onEdgeContextMenu={onEdgeContextMenu}
          onPaneContextMenu={onPaneContextMenu}
          onPaneClick={onPaneclick}
          deleteKeyCode={null}
          multiSelectionKeyCode={["Meta", "Control", "Shift"]}
          selectionMode={SelectionMode.Partial}
          selectNodesOnDrag={false}
          elevateNodesOnSelect={false}
          nodeTypes={nodeTypes}
          ariaLabelConfig={{
            "controls.ariaLabel": t.controlsPanel,
            "controls.zoomIn.ariaLabel": t.controlsZoomIn,
            "controls.zoomOut.ariaLabel": t.controlsZoomOut,
            "controls.fitView.ariaLabel": t.controlsFitView,
            "controls.interactive.ariaLabel": t.controlsInteractive,
          }}
          isValidConnection={
            (connection) => {
              const sourceNode = nodes.find(n => n.id === connection.source);
              const targetNode = nodes.find(n => n.id === connection.target);

              if (!sourceNode || !targetNode)
                return false;

              const valid = tools.canConnect(
                sourceNode.data.toolObj,
                targetNode.data.toolObj
              );
              if (!valid) {
                connectFailReasonRef.current = "protocol";
              }
              return valid;
            }
          }

          fitView
        >

          <Background />
          
          
          {menu.type === "node" && (
            <ContextMenu
              top={menu.data.top}
              left={menu.data.left}
              right={menu.data.right}
              bottom={menu.data.bottom}
              actions={[
                { label: t.copyNode, onClick: () => copyNode(menu.data.id) },
                ...(nodes.find(n => n.id === menu.data.id)?.type === "textbox"
                  ? [
                    {
                      swatches: COMMENT_COLORS.map(color => ({
                        color,
                        active: (nodes.find(n => n.id === menu.data.id)?.data.color || null) === color,
                        onClick: () => setNodeColor(menu.data.id, color),
                      })),
                    },
                    { label: t.bringToFront, onClick: () => bringToFront(menu.data.id) },
                    { label: t.sendToBack, onClick: () => sendToBack(menu.data.id) },
                  ]
                  : []),
                { label: t.deleteNode, onClick: () => deleteNode(menu.data.id), danger: true }
              ]}
              onClose={onPaneclick}
            />
            )
          }

          {menu.type === "edge" && (
            <ContextMenu
              top={menu.data.top}
              left={menu.data.left}
              right={menu.data.right}
              bottom={menu.data.bottom}
              actions={[
                { label: t.deleteEdge, onClick: () => deleteEdge(menu.data.id), danger: true }
              ]}
              onClose={onPaneclick}
            />
            )
          }

          {menu.type === "pane" && (
            <ContextMenu
              top={menu.data.top}
              left={menu.data.left}
              right={menu.data.right}
              bottom={menu.data.bottom}
              actions={[
                ...(clipboardRef.current.nodes.length > 0 ? [{
                  label: t.pasteNode,
                  onClick: (e) => pasteNodes(screenToFlowPosition({ x: e.clientX, y: e.clientY })),
                }] : []),
                {
                  label: t.addComment,
                  onClick: (e) =>  {
                    const clickPosition = screenToFlowPosition({ x: e.clientX, y: e.clientY });
                    const textboxWidth = 200;
                    const textboxHeight = 100;
                    const newTextboxNode = {
                      id: "textbox_" + getId(),
                      type: "textbox",
                      position: {
                        x: clickPosition.x - textboxWidth / 2,
                        y: clickPosition.y - textboxHeight / 2,
                      },
                      data: { label: "" },
                      style: { width: textboxWidth, height: textboxHeight },
                    };
                    setNodes(nds => nds.concat(newTextboxNode));
                    setMenu({ type: null, data: null})
                  },
                },
              ]}
              onClose={onPaneclick}
            />
            )
          }
          
          <Controls />

        </ReactFlow>

      </div>
      </div>
      </div>
      <Sidebar />
      {connectToast && <div className="connect-toast">{connectToast}</div>}
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <FlowContextProvider>
      <DnDProvider>
        <SelectionContextProvider>
          <TapAddProvider>
            <Flow />
          </TapAddProvider>
        </SelectionContextProvider>
      </DnDProvider>
    </FlowContextProvider>
  </ReactFlowProvider>
);