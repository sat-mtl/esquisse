import React from "react";
import { useDnD } from "./DnDContext.jsx";
import { SidebarCompNode } from "./components/SidebarNode.jsx";
import * as templates from "./Templates.js";



export function Templatebar(){
    return(
         <div className= "tab-content">
            <SidebarCompNode template={templates.Temp1} />
        </div>
    )
};