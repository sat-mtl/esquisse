import React, { createContext, useContext, useState } from "react";

const DnDContext = createContext([null, (_) => {}]);


/*
This context stores information of what is currently being selected by the user.
type is the type of node selected
obj is the toolObj information, as listed in ToolObjects.js
*/ 
export const DnDProvider = ({ children }) => {
    const [type, setType] = useState(null);
    const [obj, setObj] = useState(null); 

    return (
        <DnDContext.Provider value={[type, setType, obj, setObj]}>
            {children}
        </DnDContext.Provider>
    );
};

export default DnDContext;

export const useDnD = () => {
    return useContext(DnDContext);
}