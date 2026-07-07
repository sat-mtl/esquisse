import React , {useState} from "react";
import SandboxNode from "./SandboxNode.jsx";
import { useSelectionContext } from "../SelectionContext.jsx";
import { useDnD } from "../DnDContext.jsx";
import { useFlowContext } from "../FlowContext.jsx";

/* A button version of pulling up the custom node pop up */
export function CustomNodeButton() {
    const [, , , , isShowModal, setIsShowModal] = useSelectionContext();

    const handleClick=() => {
        setIsShowModal(true);
    }


    return(
        <>
        <button type="button" onClick={handleClick}>
          Custom Node
        </button>
        </>
    );
}


// Popup for custom node edit screen, relies on isShowModal to toggle on and off.
// on form submit creates a new sandbox node using the information stored in custDropInfo
export function CustomNodeEditModal(){
    const [selectedNode, setSelectedNode, , ,isShowModal, setIsShowModal, custDropInfo, setCustDropInfo] = useSelectionContext();
    const [nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange] = useFlowContext();

    /*Read in strings in the format of "entry, entry, entry
    and convert to an array" */
    const unpackInput=(stringInfo)=>{ 
        let tempStr = "";
        let justEnded = false; //used to skip first space
        const entries = [];

        for(let i = 0; i < stringInfo.length; i++){
            let char = stringInfo[i];

            if(char === ','){ //string end signifier
                entries.push(tempStr);

                //reset
                justEnded = true;
                tempStr = "";
            } 
            else if(char === ' ' && justEnded){
                //skip and move on
                justEnded == false;
                //also reset tempStr 
                // (should have already been done but this reduces errors if a space is forgotten but included elsewhere)
                tempStr = "";

            }else{//add
                tempStr += char;
            }

            //check if your at the end
            if(i == stringInfo.length -1){
                entries.push(tempStr);
            }

        }

        return entries;

    }

    const addCustomNode =(custObj) =>{
    
        const [position, id] = custDropInfo; //unpack

        const newNode = {
        id: "dndNode_" + id,
        type: "sandbox",
        position: position,
        data: { 
            //label: `${type} node`,
           toolObj: custObj,
        },
    };
    setNodes((nds) => nds.concat(newNode));

    }

    
    const handleSubmit=(formID) => {
        // Prevent the browser from reloading the page
        formID.preventDefault();

        // Read the form data
        
        const form = formID.currentTarget;
        
        
        //form.member.value*/
        let name = String(document.getElementById("objName").value);
        let desc = String(document.getElementById("desc").value);
        let inputStr = String(document.getElementById("inputField").value);
        let outputStr = String(document.getElementById("outputField").value);
        
        
        

        const customNode = {
            name: name,
            external: true,
            logoFile: "",
            logoScale: 1,
            description: desc,
            input: unpackInput(inputStr),
            output: unpackInput(outputStr),
            docLink: "."
        };

        setSelectedNode(customNode);
        //close modal
        setIsShowModal(false);
        //create node
        addCustomNode(customNode)
    }

    const closeModal=()=>{ //close the modal
        setIsShowModal(false);

    }

    return(
        <div className="modal-wrapper">
            <div className="modal-body">
                <h1 className="landing-title">
                Custom Node
                </h1>

                <button type="button" onClick={closeModal}>
                    Close
                </button>
                   
                <form className = "custom-form" onSubmit= {handleSubmit} method= "POST">
                    <label for="objName">Tool name: </label>
                    <input type="text" id="objName" name= "objName" 
                        pattern="^[a-zA-Z0-9!?&#%$\. ]*$" title="Only characters, numbers, and basic punctuation" required >
                    </input> <br/> <br/>

                    <label for="desc">Description: </label>
                    <input type="text" id="desc" name= "desc" 
                    pattern= "^[a-zA-Z0-9!?&%$\. ]*$" title="Only characters, numbers, and basic punctuation" required>
                    </input>

                    <p>Please list valid inputs and outputs below with a comma between entries.
                         Connections are case sensitive and must be spelled identically.</p>

                    <label for="inputField">Inputs: </label>
                    <input type="text" id="inputField" name= "inputField" placeholder="Audio, Video, ..." pattern="^[a-zA-Z, ]*$" required>
                    </input> <br/> <br/>

                    <label for="outputField">Outputs: </label>
                    <input type="text" id="outputField" name= "outputField" placeholder="Audio, Video, ..." pattern="^[a-zA-Z, ]*$" required>
                    </input>
                    <br/>

                  
                    <button type="submit" >
                    Submit
                    </button>

                </form>


               
            </div>
        </div>
    );

}







//Sidebar node that on pull off pulls up the custom Node modal
export function SidebarCustomNode(){
    const[descr, setDescr] = useState(null);
    const [type, setType, obj, setObj] = useDnD();

    //Description box appears when mouse is inside node
    const handleMouseEnter = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setDescr({
            x: rect.left,
            y: rect.top + rect.height / 2 + 50,
        });
    };

    //Description box disappears when mouse is outside node
    const handleMouseLeave = () => {
        setDescr(null);
    }
    
    //Moves when dragged
    const onDragStart = (event, nodeType) => {
        setType(nodeType);

        setObj(null); //to update toolObj for creating a sandbox node

        event.dataTransfer.effectAllowed = "move";
        setDescr(null);
    };

    //
    const handleDoubleClick = () => {
        //
    }

    return (
        <>
            <div className="dndnode input" id="sidebar-custom-node" 
            onDoubleClick={handleDoubleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onDragStart={(event) => onDragStart(event, "custSandbox")} draggable>
                <h3 > Custom Node</h3>
            </div>

            {descr && (
                <div className="popup" style={{
                    left: descr.x - 50,
                    top: descr.y,
                }}>
                    <p> A way to add a local custom node to your diagram. Drag out to use.</p>
                </div>
            )}
        </>
    )
    
}
