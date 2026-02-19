import react from "react";
import React from "react";
import {useState} from "react";

export default function Landing({onButtonClick}){
    return (
        <div className= {"modal-wrapper"}>
            <div className= {"modal-body"}>
                <div className = "directions-overlay">
                    <h1>Welcome to the Toolbox Node Editor!</h1>
                    <p>This tool will allow you to visualize possible connections between different softwares. 
                        The tool is meant to be used as a planning tool to help you see possible workflows and
                        to understand how SAT's technologies interact with other tools.
                    </p>
                    <ul >
                        <li>To get started, drag a node from the sidebar on the right and drop it onto the canvas.</li>
                        <li>Then, click and drag from the left handle of one node to the right handle of another to connect them.</li>
                        <li>Clicking a tool in the sidebar will bring you to its documentation or website.</li>
                        <li>The sidebar also contains a number of example templates to help you get started.</li>
                    </ul>
                    <p>You can return to this screen at any time by hitting the instructions button in the top right.</p>
                    <button onClick= {() => onButtonClick()}>Understood</button>
                </div>
            </div>
        </div>);
}