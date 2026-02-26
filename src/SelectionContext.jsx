import React, { createContext, useContext, useState } from "react";

const SelectionContext = createContext([null, () => {}, null, () => {}]);

/*
This context stores information of what is currently being selected by the user.
type is the type of node selected
obj is the toolObj information, as listed in ToolObjects.js
*/ 
export const SelectionContextProvider = ({ children }) => {
    const [selectedNode, setSelectedNode] = useState(null); 
    const [hoveredNode, setHoveredNode] = useState(null); 
    return (
        <SelectionContext.Provider value={[selectedNode, setSelectedNode, hoveredNode, setHoveredNode]}>
            {children}
        </SelectionContext.Provider>
    );
};

export const useSelectionContext = () => {
    return useContext(SelectionContext);
}