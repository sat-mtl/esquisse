import React from "react";
import { useDnD } from "./DnDContext.jsx";
import { NodeTemplate } from "./components/NodeTemplate.jsx";

export default () => {
    return (
        <aside>
            <NodeTemplate logoFileName="jack.png" />
            <NodeTemplate logoFileName="Switcher.png" />
            
        </aside>
    );
};