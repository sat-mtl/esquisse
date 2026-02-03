import React, { useRef, useCallback, useState } from 'react';
import ReactFlow, { ReactFlowProvider, MarkerType, useReactFlow, addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

import { initialNodes } from "./nodes.jsx";
import { initialEdges } from "./edges.jsx";
import Sidebar from './Sidebar.jsx';
import { DnDProvider, useDnD } from './DnDContext.jsx';

import ImageNode from './ImageNode.jsx';
import ContextMenu from './ContextMenu.jsx';

let id = 0;
const getId = () => `${id++}`;

const nodeTypes = {
  image: ImageNode,
};

const addEndMarker = (edge) => ({
    ...edge,
    markerEnd: {
        type: MarkerType.Arrow,
    },
});

const Flow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();
  const [menu, setMenu] = useState(null);
  const ref = useRef(null);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();

    // check if the dropped element is valid
    if (!type) {
      return;
    }

    // project was renamed to screenToFlowPosition
    // and you don't need to subtract the reactFlowBounds.left/top anymore
    // details: https://reactflow.dev/whats-new/2023-11-10
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const newNode = {
      id: "dndNode_" + getId(),
      type,
      position,
      data: { 
        label: `${type} node`,
        ...(type === 'image' && { image: {src: 'images/Satellite.png', height: 300, width: 400} }) // Add image to data if type is image
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [screenToFlowPosition, type]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges],
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(addEndMarker(connection), eds)), [setEdges],
  );

  const onNodeContextMenu = useCallback((event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate the position of the context menu. We want to make sure it
      // doesn't get positioned off-screen
      const pane = ref.current.getBoundingClientRect();
      setMenu({
          id: node.id,
          top: event.clientY < pane.height -200 && event.clientY,
          left: event.clientX < pane.width - 200 && event.clientX,
          right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
          bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setMenu],
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneclick = useCallback(() => setMenu(null), [setMenu]);

  const duplicateNode = useCallback((id) => {
    const node = nodes.find((node) => node.id === id);
    const position = { x: node.position.x + 50, y: node.position.y + 50 };

    const newNode = {
      ...node,
      id: "duplicate_"+getId(),
      position,
    };
    
    setNodes((nds) => nds.concat(newNode));
  }, [nodes]);


  return (
    <div className='dndflow'>
      <div className='reactflow-wrapper' ref={reactFlowWrapper} style={{ height: '100%' }}>
        <ReactFlow nodes={nodes} edges={edges}
          ref={ref}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeContextMenu={onNodeContextMenu}
          onPaneClick={onPaneclick}
          nodeTypes={nodeTypes}
          fitView>
          <Background />
          {menu && <ContextMenu onClick={onPaneclick} duplicateNode={duplicateNode} {...menu} />}
          <Controls />
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
}

export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <Flow />
    </DnDProvider>
  </ReactFlowProvider>
);
