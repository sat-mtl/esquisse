# Digital Toolbox Visulization


## Description
A visulization of the toolbox of the Société des Arts Technologiques (SAT)'s software and hardware. THe visualization is a node based editor where users can build a flowchart of the tools they are conisdering useing for their projects. The goal is to allow users to understand where SAT's software fits into their workflow. In doing so the visulization indicates whether software can communicate with each other and suggest the protocols that could be used to do so. The visulization includes both SAT's software as well as many common external tools.

### Credit
Project by Matthew Ford, Sarah Hatch, Lucien La Rock, Cristian Pineda Delgado, and Taylor Meier.
Built during an internship by students from Worcester Polytechnic Institute (Mass, USA) in early 2026. (Jan-Feb).


### Portail pour dévs informatique

- Portail pour développement informatique - [Société des arts technologiques](https://www.sat.qc.ca) 
- (Précédent Portail) Pour accéder au portail: [https://sat-mtl.gitlab.io](https://sat-mtl.gitlab.io) 
- Pour nous suivre : [Twitter](https://www.twitter.com/SATmontreal)
- Discuster avec nous: [Matrix - art tech hangout](https://matrix.to/#/!xIliUlonxNfrnwiTRv:matrix.org)




## Quick Start Guide

This project was built using reactflow. Below is how to run the project locally for development purposes

#### Prerequisites
- Node.js and npm installed
- For static SVG diagrams: `sudo apt install dvisvgm texlive-latex-base texlive-pictures sed` (Linux) or equivalent packages for your OS

#### Install Dependencies
```bash
npm install
```

### Running the React Flow Toolbox

The React Flow toolbox is an interactive node-based interface for exploring tools.

#### Development Mode (with auto-reload)
```bash
npm run dev
```
Then go to: **http://localhost:9000/**

#### Production Build
```bash
npm run build
```

### Running the D3 Tools Diagram

The D3-based interactive diagram shows tool relationships.

#### Development Mode (auto-reloads)
```bash
npm run dev
```
Then go to: **http://localhost:9000/**

#### Production Build
```bash
npm run build
```

### Generating Static Diagrams

#### Static SVG Diagram
```bash
./generate_diagrams.sh
```

Find more information about the D3 diagram in [src/tools/README.md](src/tools/README.md).



## Contributing 


### Git Workflow
#### Branches
    main            
    release branch

    dev             
    longterm development branch

    feature/...     
    branches where features are developed before added to dev using a rebase workflow

    react-flow-integration
    Backup of original reactflow baseline project that was built off of.      

#### instructions for Git Workflow

##### New Feature Branch

make sure your starting branch is dev and is up to date

    git checkout dev
    git pull

make a new branch off of dev for your new feature

    //two lines
    git branch feature/your-feature-name
    git checkout feature/your-feature-name

    //shorthand (will create a branch and checkout)
    git checkout -b feature/your-feature-name


make your changes, add, commit... whatever on your new branch

when your done we need to do a rebase. 

    //make sure all of your changes are committed
    //if you have been pushing to the server make sure your code matches

    //switch to dev and pull for latest changes
    git checkout dev
    git pull


    //switch back to your branch
    git checkout feature/your-feature-name


    //then rebase dev into your branch (MUST BE ON YOUR BRANCH)
    git branch          //to check what branch your on
    git rebase dev      //pulls dev changes into your branch, but rebases them to be in the past
    
    //solve all merge conflicts

    //test the code still works
    //then your local and server copies of your branch will differ. Force push to override
    git push --force

Then on gitlab submit a git merge request to merge your branch into dev.