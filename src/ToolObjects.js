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

export function getSharedInput(toolA, toolB) {
  const inputsA = toolA.input; 
  const inputsB = toolB.input; 
  
  const shared = inputsA.find(input => inputsB.includes(input));
  return shared || null; 
}

//Tools
export const DomeportObj = {
    name: "Domeport Web",
    logoFile: "images/SATIE.png",
    description: "A tool for visualizing any video file on a dome display",
    input: ["Audio", "Video"],
    output: [],
    docLink: "https://domeport.sat.qc.ca/"
};

// export const KoaiaObj = {
//     name: "Koaia",
//     logoFile: "images/LivePose.png",
//     description: "",
//     input: [],
//     docLink: ""
// };

export const LivePoseObj = {
    name: "LivePose", 
    logoFile: "images/LivePose.png",
    description: "A command line tool which tracks people skeletons and applies filters",
    input: ["Video", "OSC"],
    output: [],
    docLink: "https://gitlab.com/sat-mtl/tools/livepose"
};

export const PointMapperObj = {
    name: "PointMapper", 
    logoFile: "logosat.png",
    description: "A prototype web controller for SATIE",
    input: ["Video", "OSC",],
    output: [], 
    docLink: "temp"
};

export const PuaraObj = {
    name: "Puara",
    logoFile: "images/puara.jpg",
    description: "A framework for building and deploying embedded systems",
    input: ["Audio", "OSC", "Gestural Data", "Sensor Data"],
    output: [],
    docLink: "https://github.com/Puara"
}; 

export const SatelliteObj = {
    name: "Satellite", 
    logoFile: "images/Satellite.png",
    description: "An immersive and social digital 3D environment accessible on the web",
    input: ["Video"],
    output: [],
    docLink: "https://gitlab.com/sat-mtl/satellite"
};

export const ScoreObj = {
    name: "Score", 
    logoFile: "logosat.png",
    description: "A sequencer for audio-visual artists, designed to create interactive shows",
    input: ["OSC", "Video", "Sensor Data", "Gestural Data", "Images"],
    output: [],
    docLink: "https://github.com/ossia/score"
};

export const SpatgrisObj = {
    name: "SpatGRIS [external]",
    logoFile: "images/spatgris.jpg",
    description: "A software designed for multichannel spatialization in 2D and 3D",
    input: ["Audio", "OSC"],
    output: [],
    docLink: "https://gris.musique.umontreal.ca/"
};