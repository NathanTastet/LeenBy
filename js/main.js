// main.js
// Programme principal
// Par Nathan TASTET - 2023

// --- IMPORT ---

import { setup3D } from './vue3d.js';
import { setupJoystick } from './joystick.js';
import { setupMotorSliders, setupSpeedSlider } from './sliderControl.js'; 
import { setupArmSelection, setup3DButton, setupControlButtons, remiseazero} from './buttonControl.js';
import { setupPresetButtons, setupPopup } from './presetButtons.js';

// --- FONCTIONS ---

// Initialisation de l'application une fois que tout est chargé
document.addEventListener("DOMContentLoaded", function() {
    setupJoystick();
    setupMotorSliders();
    setupSpeedSlider();
    setupControlButtons();
    setupArmSelection();
    setup3DButton();
    setupPresetButtons();
    setupPopup();
    setup3D();
    remiseazero();
  });