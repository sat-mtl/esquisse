import { checkValid, canConnect } from "./ToolObjects";

export function validateTemplate (template) {
    //Check if template is missing nodes or edges
    if(!template?.nodes || !template?.edges){
        console.error("Template missing nodes or edges");
        return false;
    }

    //Check if individual nodes are valid
    for(const node of template.nodes){
        if(!checkValid(node.data?.toolObj)){
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

    if (!canConnect(sourceNode.data?.toolObj, targetNode.data?.toolObj)) {
      console.error(
        `Invalid connection inside template: ${sourceNode.data?.toolObj?.name} → ${targetNode.data?.toolObj?.name}`
      );
      return false;
    }
  }

  return true;
}