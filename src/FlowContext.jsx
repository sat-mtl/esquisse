import React, { createContext, useContext, useCallback, useRef } from "react";
import { useNodesState, useEdgesState } from "@xyflow/react";

const FlowContext = createContext([]);

export const FlowContextProvider = ({ children }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const past = useRef([]);   // stack of { nodes, edges } before each action
    const future = useRef([]); // stack of { nodes, edges } after each undone action

    // Call before a mutation to save current state
    const snapshot = useCallback((currentNodes, currentEdges) => {
        past.current = [...past.current.slice(-49), {
            nodes: currentNodes,
            edges: currentEdges,
        }];
        future.current = [];
    }, []);

    // Call once after restoring flow from storage so undo has a baseline
    const initHistory = useCallback((initialNodes, initialEdges) => {
        past.current = [{ nodes: initialNodes || [], edges: initialEdges || [] }];
        future.current = [];
    }, []);

    const undo = useCallback((currentNodes, currentEdges) => {
        if (past.current.length <= 1) return; // nothing before the baseline
        future.current = [{ nodes: currentNodes, edges: currentEdges }, ...future.current.slice(0, 49)];
        past.current = past.current.slice(0, -1);
        const { nodes: n, edges: e } = past.current[past.current.length - 1];
        setNodes(n);
        setEdges(e);
    }, [setNodes, setEdges]);

    const redo = useCallback((currentNodes, currentEdges) => {
        if (!future.current.length) return;
        past.current = [...past.current, { nodes: currentNodes, edges: currentEdges }];
        const { nodes: n, edges: e } = future.current[0];
        future.current = future.current.slice(1);
        setNodes(n);
        setEdges(e);
    }, [setNodes, setEdges]);

    return (
        <FlowContext.Provider value={[nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange, snapshot, undo, redo, initHistory]}>
            {children}
        </FlowContext.Provider>
    );
};

export const useFlowContext = () => useContext(FlowContext);
