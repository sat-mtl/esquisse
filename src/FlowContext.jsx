import React, { createContext, useContext, useState } from "react";
import { useNodesState,useEdgesState } from "@xyflow/react";

const FlowContext = createContext([null, () => {},() => {}, null, () => {},() => {}]);

/*
This context stores information of what is currently in the flow
*/ 
export const FlowContextProvider = ({ children }) => {

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    
    return (
        <FlowContext.Provider value={[nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange]}>
            {children}
        </FlowContext.Provider>
    );
};

export const useFlowContext = () => {
    return useContext(FlowContext);
}