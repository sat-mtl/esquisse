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
  
  const shared = inputsA.filter(input => inputsB.includes(input));
  return shared || null; 
}

// I/O devices

export const ScreenObj = {
  name: "Screen", 
  logoFile: "./images/monitor.jpg",
  description: "An ordinary monitor or TV screen",
  input: ["Video"],
  isIO: true,
  docLink: ""
}

export const SpeakerObj = {
  name: "Speaker",
  logoFile: "./images/speaker.png",
  description: "An ordinary speaker",
  input: ["Bluetooth", "Audio"],
  isIO: true,
  docLink: ""
}

export const AudiodiceObj = {
  name: "Audiodice",
  logoFile: "./images/audiodice.png",
  logoScale: 1.8,
  description: "One of SAT's spatial audio speakers. Usually set up in an array to spatialize audio.",
  input: ["OSC", "Audio"],
  isIO: true, 
  docLink: ""
  
}

export const HapticFloorObj = {
  name: "Haptic Floor",
  logoFile: "./images/HapticFloor.png",
  logoScale: 1.8, 
  description: "A self-moving haptic floor created at SAT that generates vibrations and bends under your feet.",
  input: ["OSC"],
  isIO: true, 
  docLink: ""
}

// Tools

export const AbletonLiveObj = {
    name: "Ableton Live [external]",
    logoFile: "images/AbletonLive_logo.png",
    logoScale: 1.8,
    description: "A digital audio workstation (DAW) for music production, composition, recording, and live performance.",
    input: ["Audio", "OSC"],
    output: [],
    docLink: "https://www.ableton.com/en/"
};

export const ArdourObj = {
    name: "Ardour [external]",
    logoFile: "images/ardour_logo.png",
    description: "An open-source digital audio workstation for recording, editing, and mixing audio.",
    input: ["Audio", "OSC"],
    output: [],
    docLink: "https://ardour.org/"
};

export const BitwigObj = {
    name: "Bitwig Studio [external]",
    logoFile: "images/bitwig_logo.png",
    logoScale: 2,
    description: "A digital audio workstation for music production and live performance.",
    input: ["Audio", "OSC"],
    output: [],
    docLink: "https://www.bitwig.com/"
};

export const BlenderObj = {
    name: "Blender [external]",
    logoFile: "images/blender_logo.png",
    description: "An open-source 3D creation suite for modeling, animation, and rendering.",
    input: ["Video", "Images"],
    output: [],
    docLink: "https://www.blender.org/"
};

export const ChataigneObj = {
    name: "Chataigne [external]",
    logoFile: "images/chataigne_logo.png",
    description: "A creative control software for mapping and routing OSC, MIDI, and other protocols.",
    input: ["OSC", "Audio", "Video"],
    output: [],
    docLink: "https://benjamin.kuperberg.fr/chataigne/en"
};

export const CinderObj = {
    name: "Cinder [external]",
    logoFile: "images/cinder_logo.png",
    description: "Open source library for professional-quality creative coding in C++.",
    input: ["Video", "Audio", "OSC", "Images"],
    output: [],
    docLink: "https://libcinder.org/"
};

export const CubaseObj = {
    name: "Cubase [external]",
    logoFile: "images/cubase_logo.png",
    description: "A digital audio workstation for music recording, mixing, and editing.",
    input: ["Audio", "OSC"],
    output: [],
    docLink: "https://www.steinberg.net/cubase/"
};

export const DomeportObj = {
    name: "Domeport Web",
    logoFile: "images/domeport_web.png",
    logoScale: 1.5,
    description: "A tool for visualizing any video file on a dome display",
    input: ["Audio", "Video"],
    output: [],
    docLink: "https://domeport.sat.qc.ca/"
};

export const IsadoraObj = {
    name: "Isadora [external]",
    logoFile: "images/isadora_logo.jpeg",
    logoScale: 1.8,
    description: "Scene-based media control software with integrated projection mapping.",
    input: ["Video", "Audio", "OSC"],
    output: [],
    docLink: "https://troikatronix.com/"
};

export const KoaiaObj = {
    name: "Koaia",
    logoFile: "images/koaia_logo.png",
    description: "A tool for exploring generative AI.",
    input: ["Video", "NDI"],
    output: [],
    docLink: "https://github.com/sat-mtl/Koaia"
};

export const LeapMotionObj = {
    name: "Leap Motion [external]",
    logoFile: "images/leapmotion_logo.png",
    logoScale: 1.5,
    description: "Sensor device that supports hand and finger motions as input.",
    input: ["Gestural Data", "OSC"],
    output: [],
    docLink: "https://www.ultraleap.com/"
};

export const LivePoseObj = {
    name: "LivePose",
    logoFile: "images/LivePose.png",
    description: "A command line tool which tracks people skeletons and applies filters",
    input: ["Video", "OSC"],
    output: [],
    docLink: "https://github.com/sat-mtl/livepose"
};

export const MadMapperObj = {
    name: "MadMapper [external]",
    logoFile: "images/MadMapper_logo.png",
    logoScale: 1.8,
    description: "Video mapping projections and Light mapping.",
    input: ["Video", "Audio", "OSC"],
    output: [],
    docLink: "https://madmapper.com/"
};

export const MaxMSPObj = {
    name: "Max/MSP [external]",
    logoFile: "images/MaxMSP_logo.jpeg",
    logoScale: 1.8,
    description: "Visual programming language for media.",
    input: ["Audio", "Video", "OSC"],
    output: [],
    docLink: "https://cycling74.com/products/max"
};

export const NotchObj = {
    name: "Notch [external]",
    logoFile: "images/notch_logo.png",
    logoScale: 1.5,
    description: "Node-based authoring tool with a strong focus on real-time graphics.",
    input: ["Video", "Audio", "OSC", "NDI"],
    output: [],
    docLink: "https://www.notch.one/"
};

export const OBSStudioObj = {
    name: "OBS Studio [external]",
    logoFile: "images/OBS_Studio_Logo.svg.png",
    description: "An open-source software for video recording and live streaming.",
    input: ["Video", "Audio", "NDI"],
    output: [],
    docLink: "https://obsproject.com/"
};

export const P5jsObj = {
    name: "p5.js [external]",
    logoFile: "images/p5js_logo.svg",
    description: "A free and open-source JavaScript library.",
    input: ["Video", "Audio", "Images"],
    output: [],
    docLink: "https://p5js.org/"
};

export const PointMapperObj = {
    name: "PointMapper",
    logoFile: "logosat.png",
    description: "A prototype web controller for SATIE",
    input: ["Video", "OSC",],
    output: [],
    docLink: "https://toolbox.sat.qc.ca/"
};

export const ProcessingObj = {
    name: "Processing [external]",
    logoFile: "images/processing_logo.svg",
    description: "Computer programming language and IDE for visual arts.",
    input: ["Video", "Audio", "OSC", "Images"],
    output: [],
    docLink: "https://processing.org/"
};

export const PuaraObj = {
    name: "Puara",
    logoFile: "images/puara.jpg",
    description: "A framework for building and deploying embedded systems",
    input: ["Audio", "OSC", "Gestural Data", "Sensor Data"],
    output: [],
    docLink: "https://github.com/Puara"
};

export const PureDataObj = {
    name: "Pure Data [external]",
    logoFile: "images/puredata_logo.png",
    description: "Open source visual programming language for multimedia.",
    input: ["Audio", "OSC", "Video"],
    output: [],
    docLink: "https://puredata.info/"
};

export const ReaperObj = {
    name: "REAPER [external]",
    logoFile: "images/REAPER_logo.png",
    description: "A free digital audio workstation for multitrack audio recording and editing.",
    input: ["Audio", "OSC"],
    output: [],
    docLink: "https://www.reaper.fm/"
};

export const ResolumeObj = {
    name: "Resolume [external]",
    logoFile: "images/resolume_logo.svg",
    description: "Mixing of digital video and effects in realtime.",
    input: ["Video", "Audio", "OSC", "NDI"],
    output: [],
    docLink: "https://resolume.com/"
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
    name: "ossia score",
    logoFile: "images/ossiascore_logo.png",
    description: "Interactive, intermedia audio-visual sequencer.",
    input: ["OSC", "Video", "Sensor Data", "Gestural Data", "Images"],
    output: [],
    docLink: "https://github.com/ossia/score"
};

export const SmodeObj = {
    name: "Smode [external]",
    logoFile: "images/smode_logo.png",
    logoScale: 2,
    description: "A real-time 2D/3D creation, compositing and video-mapping engine.",
    input: ["Video", "Audio", "OSC", "NDI"],
    output: [],
    docLink: "https://smode.fr/"
};

export const SpatgrisObj = {
    name: "SpatGRIS [external]",
    logoFile: "images/SpatGRIS_logo.png",
    description: "A software designed for multichannel spatialization in 2D and 3D",
    input: ["Audio", "OSC"],
    output: [],
    docLink: "https://gris.musique.umontreal.ca/"
};

export const SplashObj = {
    name: "Splash",
    logoFile: "images/splash_logo.png",
    logoScale: 2,
    description: "A video mapping software, dedicated to deploying immersive spaces.",
    input: ["Video", "NDI"],
    output: [],
    docLink: "https://gitlab.com/sat-mtl/tools/splash"
};

export const SuperColliderObj = {
    name: "SuperCollider [external]",
    logoFile: "images/SuperCollider_logo.svg",
    description: "Platform for audio synthesis and algorithmic composition.",
    input: ["Audio", "OSC"],
    output: [],
    docLink: "https://supercollider.github.io/"
};

export const TouchDesignerObj = {
    name: "TouchDesigner [external]",
    logoFile: "images/TouchDesigner_logo.png",
    description: "Visual development platform to create realtime projects.",
    input: ["Video", "Audio", "OSC", "NDI"],
    output: [],
    docLink: "https://derivative.ca/"
};

export const UnrealEngineObj = {
    name: "Unreal Engine [external]",
    logoFile: "images/unrealengine_logo.png",
    description: "A real-time 3D game engine used for simulations and immersive experiences.",
    input: ["Video", "Audio", "OSC", "NDI"],
    output: [],
    docLink: "https://www.unrealengine.com/"
};

export const VCVRackObj = {
    name: "VCV Rack [external]",
    logoFile: "images/VCVrack_logo.png",
    description: "An open-source virtual modular synthesizer.",
    input: ["Audio", "OSC"],
    output: [],
    docLink: "https://vcvrack.com/"
};

export const VDMXObj = {
    name: "VDMX [external]",
    logoFile: "images/vdmx_logo.png",
    logoScale: 2,
    description: "Realtime multimedia performance application.",
    input: ["Video", "Audio", "OSC", "NDI"],
    output: [],
    docLink: "https://vidvox.net/"
};

export const VezerObj = {
    name: "Vezér [external]",
    logoFile: "images/vezer_logo.png",
    description: "A timeline-based MIDI, OSC, and DMX sequencer for live shows.",
    input: ["OSC", "Audio"],
    output: [],
    docLink: "https://imimot.com/vezer/"
};

export const VRChatObj = {
    name: "VRChat [external]",
    logoFile: "images/vrchat_logo.png",
    logoScale: 1.5,
    description: "A social virtual reality platform for creating and exploring 3D worlds.",
    input: ["Video", "Audio", "OSC"],
    output: [],
    docLink: "https://hello.vrchat.com/"
};

export const VVVVObj = {
    name: "vvvv [external]",
    logoFile: "images/vvvv_logoo.png",
    logoScale: 2,
    description: "Hybrid visual/textual live-programming environment for easy prototyping and development.",
    input: ["Video", "Audio", "OSC"],
    output: [],
    docLink: "https://vvvv.org/"
};

export const WwiseObj = {
    name: "Wwise [external]",
    logoFile: "images/wwise_logo.png",
    description: "An audio middleware solution for interactive media and video games.",
    input: ["Audio", "OSC"],
    output: [],
    docLink: "https://www.audiokinetic.com/en/wwise/overview/"
};