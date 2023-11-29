// buttonControl.js
// Gère les boutons et les sélections dans l'interface utilisateur.
// Par Nathan TASTET - 2023


// ---- IMPORTS ----
import { motorInfo } from './motorInfo.js';
import { updateSliderStyle } from './sliderControl.js';
import { sendAnglesInfo, sendPresetCommand } from './websocket.js';
import { resize3d } from './vue3d.js';

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


export function remiseazero() {
  motorInfo.forEach(motor => {
      let slider = document.getElementById(`angle-slider${motor.id}`);
      let angle = document.getElementById(`angle-number${motor.id}`);
      let texte = document.getElementById(`angle-text${motor.id}`);

      // Animation
      let currentVal = parseFloat(slider.value);
      let interval = 5; // Interval en millisecondes pour la transition
      let duration = 200; // Durée totale de l'animation en millisecondes
      let step = Math.abs(currentVal) / (duration / interval); // Combien soustraire à chaque intervalle
      if(currentVal>=0){
        let animateSlider = setInterval(() => {
            currentVal -= step;
            if (currentVal <= 0) {
                currentVal = 0;
                clearInterval(animateSlider);
            }
            slider.value = currentVal;
            angle.value = currentVal.toFixed(1);
            texte.textContent = `${parseFloat(slider.value).toFixed(1)}°`;
            updateSliderStyle(slider); // Mettez à jour le style si nécessaire
        }, interval);
      }
      else {
        let animateSlider2 = setInterval(() => {
            currentVal += step; // Incrémente la valeur puisqu'elle est négative
            if (currentVal >= 0) {
                currentVal = 0; // Assurez-vous de ne pas dépasser zéro
                clearInterval(animateSlider2);
            }
            slider.value = currentVal;
            angle.value = currentVal.toFixed(1);
            texte.textContent = `${parseFloat(slider.value).toFixed(1)}°`;
            updateSliderStyle(slider); // Mettez à jour le style si nécessaire
        }, interval);
      }
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


  export function setup3DButton() {
    const button = document.getElementById("vue3DButton");
    const rightDiv = document.getElementById("right");
    const right2Div = document.getElementById("right2");
  
    button.addEventListener("click", () => {
      // Si rightDiv est visible, commencez la transition vers right2Div
      if (getComputedStyle(rightDiv).opacity === "1") {
        rightDiv.style.opacity = "0";
        button.classList.add("active");
  
        setTimeout(() => {
          rightDiv.style.display = "none";
          right2Div.style.display = "block";
          resize3d();
          // Utilisez requestAnimationFrame pour s'assurer que la transition d'opacité démarre après que la div soit visible
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              right2Div.style.opacity = "1";
            });
          });
        }, 500); // Ce délai doit correspondre à la durée de la transition CSS
      } else {
        right2Div.style.opacity = "0";
        button.classList.remove("active");
  
        setTimeout(() => {
          right2Div.style.display = "none";
          rightDiv.style.display = "block";
          // Utilisez requestAnimationFrame ici également
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              rightDiv.style.opacity = "1";
            });
          });
        }, 500);
      }
    });
  }
  