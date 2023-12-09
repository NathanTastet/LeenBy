// ui.js
// Gère les éléments d'interface utilisateur et leur interaction.
// Par Nathan TASTET - 2023

// --- IMPORT ---
import { setupMotorSliders } from './sliderControl.js';
import { setupControlButtons, setupArmSelection, setupPresetButtons, remiseazero, setup3DButton } from './buttonControl.js';
import { setupJoystick } from './joystick.js';

// --- FONCTIONS ---


// Fonction principale pour initialiser l'interface utilisateur.
export function initUI() {
    setupJoystick();         // Configure le joystick
    setupMotorSliders();
    setupControlButtons();
    setupArmSelection();
    setup3DButton();
    setupPresetButtons();
    setupLeftRightDivs();
    remiseazero();
}

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