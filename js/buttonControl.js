// buttonControl.js
// Gère les boutons et les sélections dans l'interface utilisateur.
// Par Nathan TASTET - 2023


// ---- IMPORTS ----
import { motorInfo } from './motorInfo.js';
import { updateSliderStyle } from './sliderControl.js';
import { sendAnglesInfo, sendPresetCommand } from './websocket.js';

// ---- FONCTIONS ----

// Configure les boutons de contrôle, tels que reset et valider.
export function setupControlButtons() {
    document.getElementById("reset_button").addEventListener("click", remiseazero);
    document.getElementById("check_button").addEventListener("click", validerAngles);
}


// Configure la sélection des bras (gauche, droit, les deux).
export function setupArmSelection() {
    const armButtons = document.querySelectorAll(".armButton");
    armButtons.forEach(button => {
        button.addEventListener("click", () => {
            armButtons.forEach(innerButton => innerButton.classList.remove("active"));
            button.classList.add("active");
        });
    });
}


// Remet à zéro tous les sliders et les angles.
export function remiseazero() {
    motorInfo.forEach(motor => {
        let texte = document.getElementById(`angle-text${motor.id}`);
        let slider = document.getElementById(`angle-slider${motor.id}`);
        let angle = document.getElementById(`angle-number${motor.id}`);
        texte.textContent = '0.0°';
        slider.value = 0;
        angle.value = 0;
        updateSliderStyle(slider);
    });
}


// Valide les angles sélectionnés et les envoie.
function validerAngles() {
    // Trouver le bouton actif entre bras gauche, droit et les deux
    let activeButton = document.querySelector('.armButton.active');
    // Récupérer l'identifiant du bouton actif
    let armChoice = activeButton ? activeButton.id : null; // 'leftArm', 'rightArm', ou 'bothArms'

    // Préparer l'objet à envoyer contenant les informations des angles
    let anglesInfo = {
        bras: armChoice,
        angle: {}
    };

    // Collecter les valeurs pour chaque moteur

    motorInfo.forEach(motor => {
        let angleValue = document.getElementById(`angle-number${motor.id}`).value;
        anglesInfo.angle[`angle${motor.id}`] = angleValue;
    });
    sendAnglesInfo(anglesInfo);
}

// Configuration des mouvements prédéfinis
export function setupPresetButtons() {
    const presetButtons = document.querySelectorAll('.presetBtn');
  
    presetButtons.forEach(button => {
      button.addEventListener('click', function() {
        presetButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        let movement = this.id;
        sendPresetCommand(movement); 
      });
    });
  }