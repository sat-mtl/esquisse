/*Data Objects on the Tools

While javascript is not a typed language we are treating toolObj as a type of structure
*/


export function checkValid(toolObj){
    let fields = ["name", "logoFile", "description", "input", "output", "docLink"];

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

//True if any output of the first tool is accepted as input by the second. 
export function canConnect(obj1, obj2) {
    const out = obj1?.output;
    const ins = obj2?.input;
    if (!Array.isArray(out) || !Array.isArray(ins)) {
        return false;
    }
    for (const output of out) {
        if (ins.includes(output)) return true;
    }
    return false;
}

//Returns the list of output types that the first tool can send and the second accepts. Returns null if either tool is missing or has no matching i/o types.
export function getMatchingIO(toolA, toolB) {
    const out = toolA?.output;
    const ins = toolB?.input;

    if (!Array.isArray(out) || !Array.isArray(ins)) {
        return null;
    }

    const shared = out.filter((output) => ins.includes(output));

    if (shared.length === 0) {
        return null;
    }
    return shared;
}

// I/O devices

export const ComputerObj = {
  name: "Computer",
  description: "A standard computer",
  logoFile: "./images/computer.png",
  input: ["MIDI", "Audio Stream", "Audio File", "Video Stream", "Video File", "ASCII", "Mouse Input", "Gestural Data", "OSC", "Images", "WiFi", "Bluetooth"],
  output: ["MIDI", "Audio Stream", "Audio File", "Video Stream", "Video File", "ASCII", "Mouse Input", "Gestural Data", "OSC", "Images", "WiFi", "Bluetooth"],
  docLink: ".",
}

export const RouterObj = {
  name: "Router",
  description: "A WiFi-capable router",
  logoFile: "./images/router.jpg",
  input: ["WiFi", "Wired"],
  output: ["WiFi", "Wired"],
  docLink: "."
}

export const NetworkSwitchObj = {
  name: "Network Switch",
  description: "A network switch",
  logoFile: "./images/switch.jpg",
  input: ["WiFi", "Wired"],
  output: ["WiFi", "Wired"],
  docLink: "."
}

export const ProjectorObj = {
  name: "Projector",
  description: "A projector",
  logoFile: "./images/projector.jpg",
  input: ["WiFi", "Bluetooth", "Video Stream", "Images", "Wired"],
  output: [],
  IOType: "Output",
  docLink: "."
}

export const MidiControllerObj = {
  name: "MIDI Controller",
  description: "A MIDI microcontroller",
  logoFile: "./images/midicontroller.jpg",
  input: ["Audio Stream"],
  output: ["MIDI"],
  docLink: "."
}

export const IMUMicrocontrollerObj = {
  name: "IMU Microcontroller",
  description: "An IMU-capable Microcontroller",
  logoFile: "./images/imu.jpg",
  input: ["Gestural Data", "Accelerometer Data"],
  output: ["WiFi"],
  docLink: "."
}

export const OrbbecFemtoObj = {
  name: "Orbbec Femto Mega",
  description: "A camera with 3D and IMU capabilities.",
  logoFile: "./images/femtomega.jpg",
  IOType: "Input",
  output: ["Gestural Data", "Accelerometer Data", "Video Stream", "Depth Sensor Data"],
  input: [],
  docLink: "."
}

export const RaspberryPiObj = {
  name: "Raspberry Pi",
  logoFile: "./images/raspberry pi.jpg",
  description: "A raspberry Pi microcontroller running SAT OS",
  input: ["Audio Stream", "Audio File", "Video Stream", "Video File", "ASCII", "Mouse Input", "Gestural Data", "OSC", "Images", "WiFi", "Bluetooth"],
  output: ["Audio Stream", "Audio File", "Video Stream", "Video File", "ASCII", "Mouse Input", "Gestural Data", "OSC", "Images", "WiFi", "Bluetooth"],
  docLink: "https://www.raspberrypi.com/"
}

export const HeadphoneObj = {
  name: "Headphones",
  logoFile: "./images/headphones.jpg",
  description: "An ordinary pair of headphones",
  input: ["Audio Stream", "Bluetooth"],
  output: [],
  IOType: "Output",
  docLink: "."
}

export const MicObj = {
  name: "Microphone", 
  logoFile: "./images/microphone.jpg", 
  description: "An ordinary microphone",
  input: [],
  logoScale: 1.5,
  output: ["Audio Stream"],
  IOType: "Input",
  docLink: "."
}

export const CameraObj = {
  name: "Camera",
  logoFile: "./images/camera.png",
  description: "An ordinary camera",
  input: [],
  output: ["Video Stream", "Depth Data"],
  IOType: "Input",
  docLink: "."
}

export const KeyboardObj = {
  name: "Keyboard",
  logoFile: "./images/keyboard.jpg",
  description: "A computer keyboard",
  input: [],
  output: ["ASCII"], 
  IOType: "Input",
  docLink: "."
}

export const MouseObj = {
  name: "Mouse",
  logoFile: "./images/mouse.jpg",
  description: "A computer mouse",
  input: [],
  output: ["Mouse Data"],
  IOType: "Input", 
  docLink: "."
  
}

export const ScreenObj = {
  name: "Screen", 
  logoFile: "./images/monitor.jpg",
  description: "An ordinary monitor or TV screen",
  input: ["Video Stream"],
  output: [],
  logoScale: 1.5,
  IOType: "Output",
  docLink: "."
}

export const SpeakerObj = {
  name: "Speaker",
  logoFile: "./images/speaker.png",
  description: "An ordinary speaker",
  input: ["Bluetooth", "Audio Stream"],
  output: [],
  IOType: "Output",
  docLink: "."
}

export const AudiodiceObj = {
  name: "Audiodice",
  logoFile: "./images/audiodice.png",
//   logoScale: 1.5,
  description: "One of SAT's spatial audio speakers. Usually set up in an array to spatialize audio.",
  input: ["Audio Stream"],
  output: [],
  IOType: "Output",
  isSAT: true,
  docLink: "."

}

export const HapticFloorObj = {
  name: "Haptic Floor",
  logoFile: "./images/HapticFloor.png",
  logoScale: 1.4,
  description: "A self-moving haptic floor created at SAT that generates vibrations and bends under your feet.",
  input: ["OSC"],
  output: [],
  IOType: "Output",
  isSAT: true,
  docLink: "."
}


export const LeapMotionObj = {
    name: "Leap Motion",
    external: true,
    logoFile: "images/leapmotion_logo.png",
    logoScale: 1.5,
    description: "Sensor device that supports hand and finger motions as input.",
    input: [],
    output: ["Gestural Data", "OSC"],
    IOType: "Input",
    docLink: "https://www.ultraleap.com/"
};


// Tools

export const AbletonLiveObj = {
    name: "Ableton Live",
    external: true,
    logoFile: "images/AbletonLive_logo.png",
    logoScale: 1.8,
    description: "A digital audio workstation (DAW) for music production, composition, recording, and live performance.",
    input: ["Audio Stream", "Audio File", "OSC", "MIDI"],
    output: ["Audio Stream", "Audio File", "OSC"],
    docLink: "https://www.ableton.com/en/"
};

export const ArdourObj = {
    name: "Ardour",
    external: true,
    logoFile: "images/ardour_logo.png",
    description: "An open-source digital audio workstation for recording, editing, and mixing audio.",
    input: ["Audio Stream", "Audio File", "OSC", "MIDI"],
    output: ["Audio Stream", "Audio File"],
    docLink: "https://ardour.org/"
};

export const BitwigObj = {
    name: "Bitwig Studio",
    external: true,
    logoFile: "images/bitwig_logo.png",
    logoScale: 2,
    description: "A digital audio workstation for music production and live performance.",
    input: ["Audio Stream", "Audio File", "OSC", "MIDI"],
    output: ["Audio Stream", "Audio File"],
    docLink: "https://www.bitwig.com/"
};

export const BlenderObj = {
    name: "Blender",
    external: true,
    logoFile: "images/blender_logo.png",
    description: "An open-source 3D creation suite for modeling, animation, and rendering.",
    input: ["Video File", "Images", "Audio File", "3D Models"],
    output: ["Video File", "3D Models"],
    docLink: "https://www.blender.org/"
};

export const ChataigneObj = {
    name: "Chataigne",
    external: true,
    logoFile: "images/chataigne_logo.png",
    description: "A creative control software for mapping and routing OSC, MIDI, and other protocols.",
    input: ["OSC", "Audio Stream", "Video Stream", "MIDI", "TCP", "UDP", "HTTP"],
    output: ["OSC", "Audio Stream", "Video Stream", "TCP", "UDP", "HTTP"],
    docLink: "https://benjamin.kuperberg.fr/chataigne/en"
};

export const CinderObj = {
    name: "Cinder",
    external: true,
    logoFile: "images/cinder_logo.png",
    description: "Open source library for professional-quality creative coding in C++.",
    input: ["Video Stream", "Video File", "Audio Stream", "OSC", "Images"],
    output: ["Video Stream", "Audio Stream", "OSC", "Images"],
    docLink: "https://libcinder.org/"
};

export const CubaseObj = {
    name: "Cubase",
    external: true,
    logoFile: "images/cubase_logo.png",
    description: "A digital audio workstation for music recording, mixing, and editing.",
    input: ["Audio Stream", "Audio File", "OSC"],
    output: ["Audio Stream", "Audio File", "OSC"],
    docLink: "https://www.steinberg.net/cubase/"
};

export const DomeportObj = {
    name: "Domeport Web",
    logoFile: "images/domeport_web.png",
    logoScale: 1.5,
    description: "A tool for visualizing any video file on a dome display",
    input: ["Audio File", "Video File"],
    output: ["Video Stream"],
    isSAT: true,
    docLink: "https://domeport.sat.qc.ca/"
};

export const IsadoraObj = {
    name: "Isadora",
    external: true,
    logoFile: "images/isadora_logo.jpeg",
    logoScale: 1.8,
    description: "Scene-based media control software with integrated projection mapping.",
    input: ["Video Stream", "Video File", "Audio Stream", "Audio File", "OSC", "MIDI"],
    output: ["Video Stream", "Audio Stream"],
    docLink: "https://troikatronix.com/"
};

export const KoaiaObj = {
    name: "Koaia",
    logoFile: "images/koaia_logo.png",
    description: "A tool for exploring generative AI.",
    input: ["Video Stream", "NDI"],
    output: ["OSC", "Video Stream"],
    isSAT: true,
    docLink: "https://github.com/sat-mtl/Koaia"
};

export const LivePoseObj = {
    name: "LivePose",
    logoFile: "images/LivePose.png",
    description: "A command line tool which tracks people skeletons and applies filters",
    input: ["Video Stream"],
    output: ["OSC", "RawData"],
    isSAT: true,
    docLink: "https://github.com/sat-mtl/livepose"
};

export const MadMapperObj = {
    name: "MadMapper",
    external: true,
    logoFile: "images/MadMapper_logo.png",
    logoScale: 1.8,
    description: "Video mapping projections and Light mapping.",
    input: ["Video Stream", "Video File", "Audio Stream", "MIDI", "3D Models", "OSC"],
    output: ["OSC", "Video Stream"],
    docLink: "https://madmapper.com/"
};

export const MaxMSPObj = {
    name: "Max/MSP",
    external: true,
    logoFile: "images/MaxMSP_logo.jpeg",
    logoScale: 1.8,
    description: "Visual programming language for media.",
    input: ["Audio Stream", "Video Stream", "OSC"],
    output: ["OSC"],
    docLink: "https://cycling74.com/products/max"
};

export const NotchObj = {
    name: "Notch",
    external: true,
    logoFile: "images/notch_logo.png",
    logoScale: 1.5,
    description: "Node-based authoring tool with a strong focus on real-time graphics.",
    input: ["Video Stream", "Video File", "Audio Stream", "OSC", "NDI", "3D Models"],
    output: ["Video Stream", "Audio Stream"],
    docLink: "https://www.notch.one/"
};

export const OBSStudioObj = {
    name: "OBS Studio",
    external: true,
    logoFile: "images/OBS_Studio_Logo.svg.png",
    description: "An open-source software for video recording and live streaming.",
    input: ["Video Stream", "Video File", "Audio Stream", "Audio File", "NDI"],
    output: ["Video Stream", "Audio Stream", "NDI"],
    docLink: "https://obsproject.com/"
};

export const P5jsObj = {
    name: "p5.js",
    external: true,
    logoFile: "images/p5js_logo.svg",
    description: "A free and open-source JavaScript library.",
    input: ["Video Stream", "Audio Stream", "Images"],
    output: ["Video Stream", "Audio Stream", "Images"],
    docLink: "https://p5js.org/"
};

export const PointMapperObj = {
    name: "CARTO",
    logoFile: "logosat.png",
    description: "A prototype web controller for SATIE",
    input: ["Video Stream", "OSC"],
    output: ["PointCloud", "OSC"],
    isSAT: true,
    docLink: "https://toolbox.sat.qc.ca/"
};

export const ProcessingObj = {
    name: "Processing",
    external: true,
    logoFile: "images/processing_logo.svg",
    description: "Computer programming language and IDE for visual arts.",
    input: ["Video Stream", "Video File", "Audio Stream", "OSC", "Images"],
    output: ["Video Stream", "Audio Stream", "Images"],
    docLink: "https://processing.org/"
};

export const PuaraObj = {
    name: "Puara",
    logoFile: "images/puara.jpg",
    description: "A framework for building and deploying embedded systems",
    input: ["Audio Stream", "OSC", "Gestural Data", "Sensor Data"],
    output: ["OSC", "RawData"],
    isSAT: true,
    docLink: "https://github.com/Puara"
};

export const PureDataObj = {
    name: "Pure Data",
    external: true,
    logoFile: "images/puredata_logo.png",
    description: "Open source visual programming language for multimedia.",
    input: ["Audio Stream", "OSC", "Video Stream"],
    output: ["Audio Stream", "OSC", "Video Stream"],
    docLink: "https://puredata.info/"
};

export const ReaperObj = {
    name: "REAPER",
    external: true,
    logoFile: "images/REAPER_logo.png",
    description: "A free digital audio workstation for multitrack audio recording and editing.",
    input: ["Audio Stream", "Audio File", "OSC"],
    output: ["Audio Stream", "Audio File", "OSC"],
    docLink: "https://www.reaper.fm/"
};

export const ResolumeObj = {
    name: "Resolume",
    external: true,
    logoFile: "images/resolume_logo.svg",
    description: "Mixing of digital video and effects in realtime.",
    input: ["Video Stream", "Video File", "Audio Stream", "OSC", "NDI"],
    output: ["Video Stream", "Audio Stream", "OSC", "NDI"],
    docLink: "https://resolume.com/"
};

export const SatelliteObj = {
    name: "Satellite",
    logoFile: "images/Satellite.png",
    description: "An immersive and social digital 3D environment accessible on the web",
    input: ["Video Stream", "3D Models"],
    output: ["Video Stream", "OSC", "Websocket"],
    isSAT: true,
    docLink: "https://gitlab.com/sat-mtl/satellite"
};

export const ScoreObj = {
    name: "ossia score",
    logoFile: "images/ossiascore_logo.png",
    description: "Interactive, intermedia audio-visual sequencer.",
    input: ["OSC", "Video Stream", "Video File", "Sensor Data", "Gestural Data", "Images", "Audio Stream", "Audio File"],
    output: ["OSC", "Video Stream", "Images", "Audio Stream", "Spout", "Syphon", "NDI"],
    isSAT: true,
    docLink: "https://github.com/ossia/score"
};

export const SmodeObj = {
    name: "Smode",
    external: true,
    logoFile: "images/smode_logo.png",
    logoScale: 2,
    description: "A real-time 2D/3D creation, compositing and video-mapping engine.",
    input: ["Video Stream", "Video File", "Audio Stream", "OSC", "NDI"],
    output: ["Video Stream", "Audio Stream"],
    docLink: "https://smode.fr/"
};

export const SpatgrisObj = {
    name: "SpatGRIS",
    logoFile: "images/SpatGRIS_logo.png",
    description: "A software designed for multichannel spatialization in 2D and 3D",
    input: ["Audio Stream", "OSC"],
    output: ["OSC", "Audio Stream"],
    isSAT: true,
    docLink: "https://gris.musique.umontreal.ca/"
};

export const SplashObj = {
    name: "Splash",
    logoFile: "images/splash_logo.png",
    logoScale: 2,
    description: "A video mapping software, dedicated to deploying immersive spaces.",
    input: ["Video Stream", "Video File", "NDI"],
    output: ["Video Stream"],
    isSAT: true,
    docLink: "https://gitlab.com/sat-mtl/tools/splash"
};

export const SuperColliderObj = {
    name: "SuperCollider",
    external: true,
    logoFile: "images/SuperCollider_logo.svg",
    description: "Platform for audio synthesis and algorithmic composition.",
    input: ["Audio Stream", "OSC"],
    output: ["Audio Stream"],
    docLink: "https://supercollider.github.io/"
};

export const TouchDesignerObj = {
    name: "TouchDesigner",
    external: true,
    logoFile: "images/TouchDesigner_logo.png",
    description: "Visual development platform to create realtime projects.",
    input: ["Video Stream", "Video File", "Audio Stream", "OSC", "NDI"],
    output: ["OSC", "NDI"],
    docLink: "https://derivative.ca/"
};

export const UnrealEngineObj = {
    name: "Unreal Engine",
    external: true,
    logoFile: "images/unrealengine_logo.png",
    description: "A real-time 3D game engine used for simulations and immersive experiences.",
    input: ["Video Stream", "Video File", "Audio Stream", "Audio File", "OSC", "NDI", "MIDI", "3D Models"],
    output: ["Video Stream", "Audio Stream"],
    docLink: "https://www.unrealengine.com/"
};

export const VCVRackObj = {
    name: "VCV Rack",
    external: true,
    logoFile: "images/VCVrack_logo.png",
    description: "An open-source virtual modular synthesizer.",
    input: ["Audio Stream", "OSC"],
    output: ["Audio Stream", "OSC"],
    docLink: "https://vcvrack.com/"
};

export const VDMXObj = {
    name: "VDMX",
    external: true,
    logoFile: "images/vdmx_logo.png",
    logoScale: 2,
    description: "Realtime multimedia performance application.",
    input: ["Video Stream", "Video File", "Audio Stream", "OSC", "NDI"],
    output: [],
    docLink: "https://vidvox.net/"
};

export const VezerObj = {
    name: "Vezér",
    external: true,
    logoFile: "images/vezer_logo.png",
    description: "A timeline-based MIDI, OSC, and DMX sequencer for live shows.",
    input: ["OSC", "Audio Stream", "MIDI"],
    output: [],
    docLink: "https://imimot.com/vezer/"
};

export const VRChatObj = {
    name: "VRChat",
    external: true,
    logoFile: "images/vrchat_logo.png",
    logoScale: 1.5,
    description: "A social virtual reality platform for creating and exploring 3D worlds.",
    input: ["Video Stream", "Audio Stream", "OSC"],
    output: ["Video Stream", "Audio Stream"],
    docLink: "https://hello.vrchat.com/"
};

export const VVVVObj = {
    name: "vvvv",
    external: true,
    logoFile: "images/vvvv_logoo.png",
    logoScale: 2,
    description: "Hybrid visual/textual live-programming environment for easy prototyping and development.",
    input: ["Video Stream", "Audio Stream", "OSC"],
    output: [],
    docLink: "https://vvvv.org/"
};

export const WwiseObj = {
    name: "Wwise",
    external: true,
    logoFile: "images/wwise_logo.png",
    description: "An audio middleware solution for interactive media and video games.",
    input: ["Audio Stream", "Audio File", "OSC"],
    output: ["Audio Stream"],
    docLink: "https://www.audiokinetic.com/en/wwise/overview/"
};