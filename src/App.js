import React, { useRef, useCallback, useState, useEffect, use } from "react";
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
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";


import Sidebar from "./Sidebar.jsx";


//contexts

//contexts
import { FlowContextProvider, useFlowContext } from "./FlowContext.jsx";
import { DnDProvider, useDnD } from "./DnDContext.jsx";
import { SelectionContextProvider, useSelectionContext } from "./SelectionContext.jsx";

import { TopMenuBar } from "./components/TopMenuBar.jsx";

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

  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange] = useFlowContext();
  const [menu, setMenu] = useState({ type: null, data: {} });
  
  const ref = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport } = useReactFlow();

  const [type, setType, obj, setObj] = useDnD(); //type of currently dragged item
  const [selectedNode, setSelectedNode, hoveredNode, setHoveredNode, isShowModal, 
    setIsShowModal, custDropInfo, setCustDropInfo] = useSelectionContext();

  

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

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

      const timestamp = Date.now();

      const newNodes = obj.nodes.map(n => ({
        ...n,
        id:`${n.id}-${timestamp}`,
        type: "sandbox",
        data: {toolObj: n.toolObj},
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
      return;
    }
    
    console.log("In App.js");
    console.log(obj);
    console.log(type);


    if(type == "custSandbox"){
      setCustDropInfo([position, getId()]);
      setIsShowModal(true);

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

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [screenToFlowPosition, type, obj], //end of useCallback, tells useCallback what to update to prevent staleClosures
  );

  const onConnect = useCallback(
    (connection) => {
      const sourceNode = nodes.find(n => n.id === connection.source);
      const targetNode = nodes.find(n => n.id === connection.target);
      
      if (!sourceNode || !targetNode) return;
      
      const sharedInput = tools.getMatchingIO(
        sourceNode.data.toolObj,
        targetNode.data.toolObj
      );
      
      if (!sharedInput) return;
      
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
    [nodes, setEdges],
  );

  /* Saves the state of the flow diagram to localStorage for future use */
  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);
  
  /* Enables downloading the state of the flow diagram */
  const onDownload = useCallback(() => {
    if (!rfInstance) return;
  
    const flow = rfInstance.toObject();
    const json = JSON.stringify(flow, null, 2);
  
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "reactflow-diagram.json";
    a.click();  
    
    URL.revokeObjectURL(url);
  }, [rfInstance]);
  
/* Dev feature for now: enables uploading JSON flows */
  const onUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const flow = JSON.parse(e.target.result);
      
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
        
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
  }, [setNodes, setEdges, setViewport]); 
  
  /* Restores the state of the flow diagram to whatever is saved in localStorage if it exists */
  const restoreFlow = useCallback(() => {
    const flow = JSON.parse(localStorage.getItem(flowKey));
    
    if (flow) {
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      setViewport({ x, y, zoom });
      
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
  }, [setNodes, setEdges, setViewport]);
  
  const onRestore = useCallback(() => {
    restoreFlow();
  }, [restoreFlow]);
  
  /* Controls toggling the landing page*/
  const [isLandingModalOpen, setLandingModalOpen] = useState(true);
  const onToggleLandingModal = useCallback(()=>{
    if(isLandingModalOpen){
      //console.log("landing is on, turn off");
      setLandingModalOpen(false);
     
    }else{
      //console.log("landing is off, turn on");
      setLandingModalOpen(true);
    }

  }, [isLandingModalOpen])


  
  /* Restores the state of the node diagram each time the page is reloaded */
  useEffect(() => {
    
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

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneclick = useCallback(() => setMenu({type: null, data: null}), []);

  const duplicateNode = useCallback(
    (id, e) => {
      e.stopPropagation();
      const node = nodes.find((node) => node.id === id);
      const position = { x: node.position.x + 50, y: node.position.y + 50 };

      const newNode = {
        ...node,
        id: "duplicate_" + getId(),
        position,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes],
  );

  const deleteNode = useCallback((id) => {
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
        setEdges((edges) => edges.filter((edge) => edge.source !== id));
        setMenu({ type: null, data: null }); //Close context menu
    }, [setNodes, setEdges]
  );

  const deleteEdge = useCallback((id) =>{
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
    setMenu({ type: null, data: null }); //Close context menu
  }, [setEdges]);    

  return (
    <div className="dndflow">
      <div
        className="reactflow-wrapper"
        ref={reactFlowWrapper}
        style={{ height: "100%" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          edgeTypes={edgeTypes}
          ref={ref}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setRfInstance}
          connectionLineComponent={ConnectionLine}
          onNodeContextMenu={onNodeContextMenu}
          onEdgeContextMenu={onEdgeContextMenu}
          onPaneContextMenu={onPaneContextMenu}
          onPaneClick={onPaneclick}
          nodeTypes={nodeTypes}
          isValidConnection={
            (connection) => {
              const sourceNode = nodes.find(n => n.id === connection.source);
              const targetNode = nodes.find(n => n.id === connection.target);
              
              if (!sourceNode || !targetNode)
                return false;
              
              return tools.canConnect(
                sourceNode.data.toolObj, 
                targetNode.data.toolObj
              )
            }
          }
          
          fitView
        >

          <Panel>
            {isLandingModalOpen && <Landing onButtonClick={onToggleLandingModal}/>}
            {isShowModal && <CustomNodeEditModal/>}
          </Panel>
          
          <Background />
          <Panel position="top-left">
            <TopMenuBar
              onDownload={onDownload}
              onSave={onSave}
              onRestore={onRestore}
              onUpload={onUpload}
              onInstructions={onToggleLandingModal}
            />
          </Panel>
          
          
          {menu.type === "node" && (
            <ContextMenu
              top={menu.data.top}
              left={menu.data.left}
              right={menu.data.right}
              bottom={menu.data.bottom}
              actions={[
                { label: "Duplicate Node", onClick: (e) => duplicateNode(menu.data.id, e)},
                { label: "Delete Node", onClick: () =>  deleteNode(menu.data.id)}
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
                { label: "Delete Edge", onClick: () =>  deleteEdge(menu.data.id)}
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
                  onClick: (e) =>  {
                    e.stopPropagation();
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
      <Sidebar />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <FlowContextProvider>
      <DnDProvider>
        <SelectionContextProvider>
          <Flow />
        </SelectionContextProvider>
      </DnDProvider>
    </FlowContextProvider>
  </ReactFlowProvider>
);