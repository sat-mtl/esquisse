import React, { useState } from "react";
import { Toolbar } from "./Toolbar.jsx";
import { Templatebar } from "../Templatebar.jsx";

//Add here to create additional tabs
const tabs = [
    {title: "Tools", content: <Toolbar />},
    {title: "Template Flows", content: <Templatebar />}
]

export function SidebarTabs(){
    const[active, setActive] = useState(0);

    return(
        <div className="top-section-sidebar">        
            <div className="menu-bar">
                {tabs.map((tab, i) => (
                    <button 
                        key={i}
                        className={active === i ? 'active' : ''}
                        onClick={() => setActive(i)}
                        >
                            {tab.title}
                    </button>
                ))}    
            </div>

            <div className="tab-wrapper">
                {tabs[active].content}  
            </div>
        </div>
        
    )
}