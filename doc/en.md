# 🌌 Constellation-Generator

## Contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)

## Description

**Constellation-Generator** is a simple visual constellation generator on HTML5 Canvas.  
The project is built from scratch using pure JavaScript without external libraries.

🔹 Particles move in random directions  
🔹 Particles connect with lines if they are close to each other  
🔹 Customization support through settings interface (color, number of particles, speed, etc.)  
🔹 Two project structure versions (monolithic, modular)

**Project Structure:**  

- **Monolithic** — all code in one file, simpler to understand. Uses less memory but more CPU resources.
- **Modular** — code is split into modules, easier to extend and maintain. Uses more memory but fewer CPU resources.

## Installation

### 1️⃣ Clone the repository:
```bash
git clone https://github.com/SergeySoftDrop/Constellation-Generator.git
```

### 2️⃣ Or download the .zip archive:
[Download ZIP](https://github.com/SergeySoftDrop/Constellation-Generator/archive/refs/heads/main.zip)

### 3️⃣ Go to the `src` folder and open the `index.html` file in your browser.

## Usage

#### By default, the monolithic structure is used, and the project can be launched without a web server.

To use the modular version, replace the `monolithic/index.js` script connection with `modular/main.js`:

```HTML
<!-- <script src="monolithic/index.js"></script> -->
<script src="modular/main.js" type="module"></script>
```
