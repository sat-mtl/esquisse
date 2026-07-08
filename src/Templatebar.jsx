import React from "react";
import { SidebarCompNode } from "./components/SidebarNode.jsx";

// Auto-loads all JSON files from src/templates/ — add a file there and it appears here
const templateContext = require.context('./templates', false, /\.json$/);
const allTemplates = templateContext.keys().map(key => templateContext(key));

export function Templatebar() {
    return (
        <div className="tab-content tab-content--templates">
            {allTemplates.map((template, i) => (
                <SidebarCompNode key={i} template={template} />
            ))}
        </div>
    );
}
