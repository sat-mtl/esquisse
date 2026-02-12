/*Data Objects on the Tools

While javascript is not a typed language we are treating toolObj as a type of structure
*/


export function checkValid(toolObj){
    let fields = ["name", "logoFile", "description", "input", "docLink"];

    if (toolObj == null){ // if given empty object, false
        return false;
    }

    let isValid = true;

    //Lambda to check whether each field in list exist in the object
    //if no, sets isValid to false
    const fieldExists = (fieldName) => { 
        if (toolObj[fieldName] == null){
          isValid = false;
        } 
    }

    fields.forEach(fieldExists);
    return isValid;
}

export function canConnect(obj1, obj2) {
  for (const input of obj1.input) {
    if (obj2.input.includes(input)) {
      return true;
    }
  }
  return false;
}


export const OssiaObj = {
    name: "Ossia", 
    logoFile: "/images/HapticFloor.png",
    description: "Temp Description",
    input: ["Audio", "Video"],
    docLink: "temp"};

export const AudioDiceObj = {
    name: "Audio Dice", 
    logoFile: "images/audiodice.png",
    description: "A set of 5 speakers comprised of 12 independent drivers each",
    input: ["Temp", "Temp"],
    docLink: "https://gitlab.com/sat-mtl/tools/audiodice"
};

export const PoireObj = {
    name: "Poire", 
    logoFile: "images/poire.png",
    description: "A prototype web controller for SATIE",
    input: ["Temp", "Temp"],
    docLink: "https://gitlab.com/sat-mtl/metalab/poire"
};

export const LivePoseObj = {
    name: "LivePose", 
    logoFile: "images/LivePose.png",
    description: "A command line tool which tracks people skeletons and applies filters",
    input: ["Temp", "Temp"],
    docLink: "https://gitlab.com/sat-mtl/tools/livepose"
};