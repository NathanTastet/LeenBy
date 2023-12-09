// main.js
// Programme principal
// Par Nathan TASTET - 2023

// --- IMPORT ---

import { initUI } from './ui.js';
import { setup3D } from './vue3d.js';

// --- FONCTION ---

// Initialisation de l'application une fois que tout est chargé
document.addEventListener("DOMContentLoaded", function() {
  initUI();                // Initialise l'interface utilisateur
  setup3D();               // Configure la vue 3d
});