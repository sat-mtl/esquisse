import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  MarkerType,
  useReactFlow,
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
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

const Flow = () => {
  const reactFlowWrapper = useRef(null);

  const { screenToFlowPosition, deleteElements } = useReactFlow();
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

  const [connectToast, setConnectToast] = useState(null);
  const connectSourceRef = useRef(null);
  const connectCompletedRef = useRef(false);
  const toastTimerRef = useRef(null);
  const connectFailReasonRef = useRef(null);

  

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

  // Undo/redo + delete keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      // Skip if user is typing in an input/textarea
      if (e.target.closest("input, textarea, [contenteditable]")) return;

      const mod = e.metaKey || e.ctrlKey;
      if (mod) {
        if (e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(nodes, edges); return; }
        if ((e.key === "z" && e.shiftKey) || e.key === "y") { e.preventDefault(); redo(nodes, edges); return; }
      }

      if (e.key === "Backspace" || e.key === "Delete") {
        const selectedNodes = nodes.filter(n => n.selected);
        const selectedEdges = edges.filter(ed => ed.selected);
        if (!selectedNodes.length && !selectedEdges.length) return;
        e.preventDefault();
        snapshot(nodes, edges);
        deleteElements({ nodes: selectedNodes, edges: selectedEdges });
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [undo, redo, nodes, edges, snapshot, deleteElements]);

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
        alert("Template Invalid");
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
      if (obj.name) setFlowName(obj.name);
      if (obj.description) setFlowDescription(obj.description);
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
      if (!validateTemplate(template)) { alert("Template Invalid"); return; }
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
      if (template.name) setFlowName(template.name);
      if (template.description) setFlowDescription(template.description);
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
          msg = "Wrong direction — connect from the right handle (output) to the left handle (input) of another tool.";
        } else {
          const outputs = sourceNode.data.toolObj.output;
          msg = outputs?.length
            ? `No shared protocol — ${sourceNode.data.toolObj.name} outputs: ${outputs.join(", ")}`
            : `No compatible protocols between these tools.`;
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
      const sourceNode = nodes.find(n => n.id === connection.source);
      const targetNode = nodes.find(n => n.id === connection.target);
      
      if (!sourceNode || !targetNode) return;
      
      const sharedInput = tools.getMatchingIO(
        sourceNode.data.toolObj,
        targetNode.data.toolObj
      );
      
      if (!sharedInput) return;

      snapshot(nodes, edges);
      setEdges((eds) =>
        addEdge(
          addEndMarker({
            ...connection,
            type: "custom",
            data: { 
              sharedInput,
              protocol: "" },
          }),
          eds
        )
      );
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

      // Calculate the position of the context menu. We want to make sure it
      // doesn't get positioned off-screen
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        type: "node",
        data: {
          id: node.id,
          top: event.clientY < pane.height - 200 && event.clientY,
          left: event.clientX < pane.width - 200 && event.clientX,
          right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
          bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
        }
      });
    },
    [setMenu],
  );

  const onEdgeContextMenu = useCallback((event, edge) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate the position of the context menu. We want to make sure it
      // doesn't get positioned off-screen
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        type: "edge",
        data: {
          id: edge.id,
          top: event.clientY < pane.height - 200 && event.clientY,
          left: event.clientX < pane.width - 200 && event.clientX,
          right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
          bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
        }
      });
    },
    [setMenu],
  )

  const onPaneContextMenu = useCallback((event) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate the position of the context menu. We want to make sure it
      // doesn't get positioned off-screen
      const pane = ref.current.getBoundingClientRect();
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      setMenu({
        type: "pane",
        data: {
          top: event.clientY < pane.height - 200 && event.clientY,
          left: event.clientX < pane.width - 200 && event.clientX,
          right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
          bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
          position,
        }
      });
    },
    [screenToFlowPosition],
  )

  // Close context menu and deselect node when canvas is clicked
  const onPaneclick = useCallback(() => {
    setMenu({ type: null, data: null });
    setSelectedNode(null);
  }, [setSelectedNode]);

  const duplicateNode = useCallback(
    (id) => {
      // Collect all selected duplicable nodes; fall back to the right-clicked node
      const targets = nodes.filter(n => n.selected && n.data?.toolObj?.isIO);
      const toClone = targets.length > 0 ? targets : nodes.filter(n => n.id === id && n.data?.toolObj?.isIO);

      if (!toClone.length) return;

      snapshot(nodes, edges);
      setNodes(nds => nds.concat(
        toClone.map(node => ({
          ...node,
          id: "duplicate_" + getId(),
          position: { x: node.position.x + 50, y: node.position.y + 50 },
          selected: false,
        }))
      ));
    },
    [nodes, edges, snapshot],
  );

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
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setRfInstance}
          connectionLineComponent={ConnectionLine}
          onNodeContextMenu={onNodeContextMenu}
          onEdgeContextMenu={onEdgeContextMenu}
          onPaneContextMenu={onPaneContextMenu}
          onPaneClick={onPaneclick}
          deleteKeyCode={null}
          nodeTypes={nodeTypes}
          isValidConnection={
            (connection) => {
              const sourceNode = nodes.find(n => n.id === connection.source);
              const targetNode = nodes.find(n => n.id === connection.target);

              if (!sourceNode || !targetNode)
                return false;

              // Drop on an output handle = wrong direction (output→output or input→output)
              if (connection.targetHandle === "output") {
                connectFailReasonRef.current = "direction";
                return false;
              }

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
                ...(nodes.find(n => n.id === menu.data.id)?.data?.toolObj?.isIO
                  ? [{ label: "Duplicate Node", onClick: () => duplicateNode(menu.data.id) }]
                  : []),
                { label: "Delete Node", onClick: () => deleteNode(menu.data.id), danger: true }
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
                { label: "Delete Edge", onClick: () => deleteEdge(menu.data.id), danger: true }
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
                { 
                  label: "Add comment", 
                  onClick: () =>  {
                    const position = menu.data.position;
                    const newTextboxNode = {
                      id: "textbox_" + getId(),
                      type: "textbox",
                      position,
                      data: { label: "" },
                      style: { width: 200, height: 100},
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