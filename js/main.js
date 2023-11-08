// main.js
// Programme principal
// Par Nathan TASTET - 2023

// --- IMPORT ---

import { initUI } from './ui.js';
import { setupJoystick } from './joystick.js';

// --- FONCTION ---

// Initialisation de l'application une fois que tout est chargé
document.addEventListener("DOMContentLoaded", function() {
  initUI();                // Initialise l'interface utilisateur
  setupJoystick();         // Configure le joystick
});