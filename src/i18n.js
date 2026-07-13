export const strings = {
  fr: {
    // Sidebar tabs
    tabSoftware: "Logiciels",
    tabHardware: "Matériel",
    tabTemplates: "Gabarits",

    // Top menu bar
    instructions: "INSTRUCTIONS",
    newFile: "NOUVEAU",
    download: "TÉLÉCHARGER",
    upload: "IMPORTER",
    flowNamePlaceholder: "Nom du schéma…",
    flowDescriptionPlaceholder: "Description…",

    // Protocol filter / edge dropdown
    allProtocols: "Tous les protocoles",
    selectProtocol: "choisir un protocole",

    // ReactFlow Controls tooltips
    controlsPanel: "Panneau de contrôle",
    controlsZoomIn: "Agrandir",
    controlsZoomOut: "Réduire",
    controlsFitView: "Ajuster la vue",
    controlsInteractive: "Basculer l'interactivité",

    // Node details panel
    documentation: "Documentation",
    dataSheet: "Fiche technique",
    emptyTool: "Glissez un logiciel sur la toile, puis cliquez dessus pour voir ses détails ici.",
    emptyHardware: "Glissez un appareil sur la toile, puis cliquez dessus pour voir ses détails ici.",
    emptyTemplates: "Glissez un gabarit sur la toile pour l'ajouter comme point de départ.",
    inputLabel: "Entrée",
    outputLabel: "Sortie",

    // Custom node modal
    customSoftwareTitle: "Logiciel personnalisé",
    customHardwareTitle: "Appareil personnalisé",
    customSoftwareName: "Nom du logiciel",
    customHardwareName: "Nom de l'appareil",
    customDescription: "Description",
    customDirection: "Direction",
    customDirectionBoth: "Entrée et sortie",
    customDirectionInput: "Entrée seulement (envoie un signal)",
    customDirectionOutput: "Sortie seulement (reçoit un signal)",
    customProtocolsHint: "Listez les protocoles séparés par des virgules. Sensible à la casse.",
    customInputProtocols: "Protocoles d'entrée",
    customOutputProtocols: "Protocoles de sortie",
    customSubmit: "Ajouter à la toile",
    customClose: "Fermer",

    // Sidebar custom node tooltips
    customSoftwareTooltip: "Ajoutez un logiciel personnalisé. Glissez pour utiliser.",
    customHardwareTooltip: "Ajoutez un appareil personnalisé. Glissez pour utiliser.",

    // Context menu
    duplicateNode: "Dupliquer",
    deleteNode: "Supprimer",
    deleteEdge: "Supprimer la connexion",
    addComment: "Ajouter un commentaire",

    // Connection toasts
    toastDirection: "Mauvaise direction — connectez la sortie (droite) à l'entrée (gauche) d'un autre outil.",
    toastNoProtocol: "Aucun protocole partagé",

    // Landing page
    landingTitle: "Bienvenue dans Esquisse",
    landingTooltip: "Cet outil vous aide à visualiser les connexions entre différents logiciels et à planifier des flux de travail. Utilisez-le pour voir comment les technologies de la SAT interagissent avec d'autres outils.",
    landingStep1: "Glissez un logiciel ou un appareil de la barre latérale sur la toile. Sur mobile, appuyez dessus pour l'ajouter.",
    landingStep2: "Connectez les nœuds en faisant glisser d'un connecteur à un autre. Sur mobile, les connexions ne sont pas supportées.",
    landingStep3: "Cliquez sur un outil dans la barre latérale pour voir sa documentation. Sur mobile, appuyez sur un outil sur la toile pour voir ses détails.",
    landingStep4: "Utilisez les gabarits d'exemple dans la barre latérale pour commencer.",
    landingUnderstood: "COMPRIS",
    switchLang: "Switch to English",
    landingMobileNote: "Pour une meilleure expérience, utilisez Esquisse sur un ordinateur de bureau ou portable.",

    // Validation / error messages
    nodeError: "Erreur d'affichage de ce nœud.",
    nodeErrorDetail: "Aucun objet outil transmis.",
    templateInvalid: "Gabarit invalide",
    inputValidation: "Caractères, chiffres et ponctuation de base uniquement.",
  },

  en: {
    tabSoftware: "Software",
    tabHardware: "Hardware",
    tabTemplates: "Templates",

    instructions: "INSTRUCTIONS",
    newFile: "NEW",
    download: "DOWNLOAD",
    upload: "UPLOAD",
    flowNamePlaceholder: "Flow name…",
    flowDescriptionPlaceholder: "Description…",

    allProtocols: "All protocols",
    selectProtocol: "select protocol",

    // ReactFlow Controls tooltips
    controlsPanel: "Control Panel",
    controlsZoomIn: "Zoom In",
    controlsZoomOut: "Zoom Out",
    controlsFitView: "Fit View",
    controlsInteractive: "Toggle Interactivity",

    documentation: "Documentation",
    dataSheet: "Data Sheet",
    emptyTool: "Drag a tool onto the canvas, then click it to see its details here.",
    emptyHardware: "Drag a device onto the canvas, then click it to see its details here.",
    emptyTemplates: "Drag a template onto the canvas to add it as a starting point.",
    inputLabel: "Input",
    outputLabel: "Output",

    customSoftwareTitle: "Custom Node",
    customHardwareTitle: "Custom Device",
    customSoftwareName: "Tool name",
    customHardwareName: "Device name",
    customDescription: "Description",
    customDirection: "Direction",
    customDirectionBoth: "Input & Output",
    customDirectionInput: "Input only (sends signal)",
    customDirectionOutput: "Output only (receives signal)",
    customProtocolsHint: "List protocols separated by commas. Case-sensitive.",
    customInputProtocols: "Input protocols",
    customOutputProtocols: "Output protocols",
    customSubmit: "Add to canvas",
    customClose: "Close",

    // Sidebar custom node tooltips
    customSoftwareTooltip: "Add a custom software tool. Drag out to use.",
    customHardwareTooltip: "Add a custom hardware device. Drag out to use.",

    duplicateNode: "Duplicate Node",
    deleteNode: "Delete Node",
    deleteEdge: "Delete Edge",
    addComment: "Add comment",

    toastDirection: "Wrong direction — connect from the right handle (output) to the left handle (input) of another tool.",
    toastNoProtocol: "No shared protocol",

    landingTitle: "Welcome to Esquisse",
    landingTooltip: "This tool helps you visualize connections between different software and plan workflows. Use it to see how SAT's technologies interact with other tools.",
    landingStep1: "Drag a tool or device from the sidebar onto the canvas. On mobile, tap a tool to add it.",
    landingStep2: "Connect nodes by dragging from one handle to another. On mobile, connections are not supported.",
    landingStep3: "Click a tool in the sidebar to see its documentation. On mobile, tap a tool on the canvas to view its details.",
    landingStep4: "Use the example templates in the sidebar to get started.",
    landingUnderstood: "UNDERSTOOD",
    switchLang: "Passer en français",
    landingMobileNote: "For the best experience, use Esquisse on a desktop or laptop.",

    // Validation / error messages
    nodeError: "Error displaying this node.",
    nodeErrorDetail: "No tool object passed.",
    templateInvalid: "Invalid template",
    inputValidation: "Only characters, numbers, and basic punctuation.",
  },
};
