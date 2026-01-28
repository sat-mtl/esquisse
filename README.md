# Portail pour dévs informatique

Portail pour développement informatique - [Société des arts technologiques](https://www.sat.qc.ca)
Pour accéder au portail: [https://sat-mtl.gitlab.io](https://sat-mtl.gitlab.io)
Pour nous suivre : [Twitter](https://www.twitter.com/SATmontreal)
Discuster avec nous: [Matrix - art tech hangout](https://matrix.to/#/!xIliUlonxNfrnwiTRv:matrix.org)

## Quick Start Guide

### Prerequisites
- Node.js and npm installed
- For static SVG diagrams: `sudo apt install dvisvgm texlive-latex-base texlive-pictures sed` (Linux) or equivalent packages for your OS

### Install Dependencies
```bash
npm install
```

## Running the React Flow Toolbox

The React Flow toolbox is an interactive node-based interface for exploring tools.

### Development Mode (with auto-reload)
```bash
npm run dev
```
Then go to: **http://localhost:9000/toolbox.html**

### Production Build
```bash
npm run build
```

## Running the D3 Tools Diagram

The D3-based interactive diagram shows tool relationships.

### Development Mode (auto-reloads)
```bash
npm run dev
```
Then go to: **http://localhost:9000/tools/index.html**

### Production Build
```bash
npm run build
```

## Generating Static Diagrams

### Static SVG Diagram
```bash
./generate_diagrams.sh
```

Find more information about the D3 diagram in [src/tools/README.md](src/tools/README.md).

