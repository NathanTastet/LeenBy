// ui.js
// Gère les éléments d'interface utilisateur et leur interaction.
// Par Nathan TASTET - 2023

// --- IMPORT ---
import { setupMotorSliders } from './sliderControl.js';
import { setupControlButtons, setupArmSelection, setupPresetButtons, remiseazero } from './buttonControl.js';

// --- FONCTIONS ---


// Fonction principale pour initialiser l'interface utilisateur.
export function initUI() {
    setupMotorSliders();
    setupControlButtons();
    setupArmSelection();
    setupPresetButtons();
    setupLeftRightDivs();
    remiseazero();
}


// Configure les interactions avec les divs 'left' et 'right'.
function setupLeftRightDivs() {
    const leftDiv = document.getElementById("left");
    const rightDiv = document.getElementById("right");

    rightDiv.addEventListener("click", function() {
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