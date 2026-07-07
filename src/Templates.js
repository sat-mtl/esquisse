import { checkValid, canConnect } from "./ToolObjects";

export function validateTemplate (template) {
    //Check if template is missing nodes or edges
    if(!template?.nodes || !template?.edges){
        console.error("Template missing nodes or edges");
        return false;
    }

    //Check if individual nodes are valid
    for(const node of template.nodes){
        if(!checkValid(node.toolObj)){
            console.error("Node is invalid");
            return false;
        }
    }

    //Check if edges are valid
    for (const edge of template.edges) {
    const sourceNode = template.nodes.find(n => n.id === edge.source);
    const targetNode = template.nodes.find(n => n.id === edge.target);

    if (!sourceNode || !targetNode) {
      console.error("Invalid edge");
      return false;
    }

    if (!canConnect(sourceNode.toolObj, targetNode.toolObj)) {
      console.error(
        `Invalid connection inside template: ${sourceNode.toolObj.name} → ${targetNode.toolObj.name}`
      );
      return false;
    }
  }

  return true;
}