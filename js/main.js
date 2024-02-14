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
    setupLeftRightDivs();
    setupPopup();
    setup3D();
    remiseazero();
  });


// Configure les interactions avec les divs 'left' et 'right'.
function setupLeftRightDivs() {
    // Obtention des divs gauche et droite
    const leftDiv = document.getElementById("left");
    const rightDiv = document.getElementById("right");

    // Ajout d'un écouteur d'événement de clic sur le div droit
    rightDiv.addEventListener("click", function(){
        // Changement de la couleur de fond et de l'index z des divs
        leftDiv.style.backgroundColor = "#EAEDED";
        leftDiv.style.zIndex = "1";
        rightDiv.style.backgroundColor = "#F4F6F7";
        rightDiv.style.zIndex = "2";
    });

    // Ajout d'un écouteur d'événement de clic sur le div gauche
    leftDiv.addEventListener("click", function() {
        // Changement de la couleur de fond et de l'index z des divs
        leftDiv.style.backgroundColor = "#F4F6F7";
        leftDiv.style.zIndex = "2";
        rightDiv.style.backgroundColor = "#EAEDED";
        rightDiv.style.zIndex = "1";
    });
}