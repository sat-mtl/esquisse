import React from "react";
import { useDnD } from "./DnDContext.jsx";
import { SidebarNode } from "./components/SidebarNode.jsx";

export default () => {
    return (
        <aside>
            <SidebarNode name="Jack" logoFileName="jack.png" />
            <SidebarNode logoFileName="Switcher.png" />           
        </aside>
    );
};