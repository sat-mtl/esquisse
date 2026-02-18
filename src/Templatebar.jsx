import React from "react";
import { useDnD } from "./DnDContext.jsx";
import { SidebarCompNode } from "./components/SidebarNode.jsx";
import * as templates from "./Templates.js";



export function Templatebar(){
    return(
         <aside>
            <SidebarCompNode template={templates.Temp1} />
            <SidebarCompNode template={templates.Temp1} />
            <SidebarCompNode template={templates.Temp1} />
            <SidebarCompNode template={templates.Temp1} />
        </aside>
    )
};