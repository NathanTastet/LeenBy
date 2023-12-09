// main.js
// Programme principal
// Par Nathan TASTET - 2023

// --- IMPORT ---

import { setup3D } from './vue3d.js';
import { setupJoystick } from './joystick.js';
import { setupMotorSliders} from './sliderControl.js'; 
import { setupArmSelection, setup3DButton, setupControlButtons, setupPresetButtons, remiseazero} from './buttonControl.js';

// --- FONCTIONS ---

// Initialisation de l'application une fois que tout est chargé
document.addEventListener("DOMContentLoaded", function() {
  setupJoystick();
  setupMotorSliders();
  setupControlButtons();
  setupArmSelection();
  setup3DButton();
  setupPresetButtons();
  setupLeftRightDivs();
  setup3D();
  remiseazero();
});

// Configure les interactions avec les divs 'left' et 'right'.
function setupLeftRightDivs() {
    const leftDiv = document.getElementById("left");
    const rightDiv = document.getElementById("right");

    rightDiv.addEventListener("click", function(){
        leftDiv.style.backgroundColor = "#EAEDED";
        leftDiv.style.zIndex = "1";
        rightDiv.style.backgroundColor = "#F4F6F7";
        rightDiv.style.zIndex = "2";
    });


    leftDiv.addEventListener("click", function() {
        leftDiv.style.backgroundColor = "#F4F6F7";
        leftDiv.style.zIndex = "2";
        rightDiv.style.backgroundColor = "#EAEDED";
        rightDiv.style.zIndex = "1";
    });
}