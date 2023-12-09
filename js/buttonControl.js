// buttonControl.js
// Gère les boutons et les sélections dans l'interface utilisateur.
// Par Nathan TASTET - 2023


// ---- IMPORTS ----
import { motorInfo } from './motorInfo.js';
import { updateSliderStyle, changerBras, adjustText, sliderValuesLeft, sliderValuesRight} from './sliderControl.js';
import { sendAnglesInfo, sendPresetCommand } from './websocket.js';
import { resize3d, update3d } from './vue3d.js';

// ---- VARIABLE ----

export let modeBras;

// ---- FONCTIONS ----

// Configure les boutons de contrôle, tels que reset et valider.
export function setupControlButtons() {
    document.getElementById("reset_button").addEventListener("click", remiseazero);
    document.getElementById("check_button").addEventListener("click", validerAngles);
}


// Configure la sélection des bras (gauche, droit, les deux).
export function setupArmSelection() {
    const armButtons = document.querySelectorAll(".armButton");
    const deuxbras = document.getElementById("deuxBras");
    deuxbras.classList.add("active");
    modeBras = deuxbras.id;
    armButtons.forEach(button => {
        button.addEventListener("click", () => {
            armButtons.forEach(innerButton => innerButton.classList.remove("active"));
            button.classList.add("active");
            modeBras = button.id;
            changerBras();
        });
    });
}

export function remiseazero() {

  motorInfo.forEach(motor => {

    let slider = document.getElementById(`angle-slider${motor.id}`);
    let angle = document.getElementById(`angle-number${motor.id}`);
    let texte_gauche = document.getElementById(`angle-text-left${motor.id}`);
    let texte_droite = document.getElementById(`angle-text-right${motor.id}`);



    let interval = 5; // Interval en millisecondes pour la transition
    let duration = 200; // Durée totale de l'animation en millisecondes

    if (modeBras == "deuxBras") {
      let currentValLeft = parseFloat(sliderValuesLeft[motor.id]);
      let currentValRight = parseFloat(sliderValuesRight[motor.id]);


      let stepLeft = Math.abs(currentValLeft) / (duration / interval);
      let stepRight = Math.abs(currentValRight) / (duration / interval);

      let currentVal = parseFloat(slider.value);
      let step = Math.abs(currentVal) / (duration / interval); // Combien soustraire à chaque intervalle

      let animateBothArms = setInterval(() => {
        if (currentValLeft != 0) {
        // Animation pour le bras gauche
          currentValLeft += currentValLeft> 0 ? -stepLeft : stepLeft;

          if (Math.abs(currentValLeft) < stepLeft) currentValLeft = 0;
          sliderValuesLeft[motor.id] = currentValLeft;
          texte_gauche.textContent = parseFloat(sliderValuesLeft[motor.id]).toFixed(1) + '°';
        }

        // Animation pour le bras droit
        if (currentValRight != 0) {
          currentValRight += currentValRight > 0 ? -stepRight : stepRight;
          if (Math.abs(currentValRight) < stepRight) currentValRight = 0;
          sliderValuesRight[motor.id] = currentValRight;
          texte_droite.textContent = parseFloat(sliderValuesRight[motor.id]).toFixed(1) + '°';
        }

        // animation pour le slider
        if(currentVal != 0){
          currentVal += currentVal > 0 ? -step : step;
    
          // Vérification si la valeur est proche de zéro
          if (Math.abs(currentVal) < step) currentVal = 0;
          slider.value = currentVal;
          angle.value = currentVal.toFixed(1);

        }

        update3d();
        updateSliderStyle(slider);

        // Vérifier si les trois animations sont terminées
        if (currentValLeft === 0 && currentValRight === 0 && currentVal === 0) {
          clearInterval(animateBothArms);
        }
      }, interval);
    }

    else {
      let currentVal = parseFloat(slider.value);
      let step = Math.abs(currentVal) / (duration / interval); // Combien soustraire à chaque intervalle
    
      let animateSlider = setInterval(() => {

        currentVal += currentVal > 0 ? -step : step;
    
        // Vérification si la valeur est proche de zéro
        if (Math.abs(currentVal) < step) {
          currentVal = 0;
          clearInterval(animateSlider);
        }
    
        slider.value = currentVal;
        angle.value = currentVal.toFixed(1);
        adjustText(slider, texte_gauche, texte_droite);
        update3d();
        updateSliderStyle(slider);
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
        right2Div.style.opacity = "0";
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
        rightDiv.style.opacity = "0";
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
  