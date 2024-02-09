// presetButtons.js
// Boutons pour enregistrer et exécuter des mouvements
// Par Nathan TASTET - 2024

// ---- IMPORTS ----

import { sliderValuesLeft, sliderValuesRight,  animateSliderValue } from './sliderControl.js';
import { motorInfo } from './motorInfo.js';
import { modeBras } from './buttonControl.js';
// ---- VARIABLES ----

export var mvtEnregistre = [];
var position = 0;
let targetValue = 0;


export var isRecording = false;

// ---- FONCTIONS ----

// Initialise les boutons de presets
export function setupPresetButtons() {

    const presetSection = document.getElementById('presetSection');

    // initialisation du tableau de mouvements avec des cases vides
    for (let i = 1; i <= 7; i++) {
      mvtEnregistre[i] = {left: [], right: []};

      motorInfo.forEach(motor => {
        var id = parseInt(motor.id);
        mvtEnregistre[i].left[id] = parseFloat(0);
        mvtEnregistre[i].right[id] = parseFloat(0);
      });
      
    }

    // Création et ajout des 7 boutons de presets
    for (let i = 1; i <= 7; i++) {

      const button = document.createElement('button');
      button.className = 'presetBtn';
      button.id = `preset${i}`;
      button.innerHTML = `<span class="btnText">Preset ${i}</span>`;
      presetSection.appendChild(button);

      // Ajout d'un écouteur d'événement sur chaque bouton de preset
      button.addEventListener('click', function() {
          if(!isRecording){
            document.querySelectorAll('.presetBtn:not(#enregBtn)').forEach(btn => btn.classList.remove('active'));
            
            // faut que j'actualise les valeurs des sliders
            // faut que je parcours la longueur de mvtEnregistre[i].left pour remplacer les valeurs des sliders 1 par 1

            for (let j = 0; j < mvtEnregistre[i].left.length; j++) {
              sliderValuesLeft[j] = mvtEnregistre[i].left[j];
              sliderValuesRight[j] = mvtEnregistre[i].right[j];
            }

            motorInfo.forEach(motor => {
              let angle = document.getElementById(`angle-number${motor.id}`);
              switch (modeBras) {
                case 'brasGauche':
                  targetValue = sliderValuesLeft[motor.id];
                    break;
                case 'brasDroit':
                  targetValue = sliderValuesRight[motor.id];
                    break;
                case 'deuxBras':
                  if(sliderValuesLeft[motor.id] == sliderValuesRight[motor.id]){
                    targetValue = sliderValuesLeft[motor.id];
                  }else{
                    targetValue = 0;
                  }
                  break;
               }
               var event = new Event('input', {
                bubbles: true,
                cancelable: true,
               });
               angle.value = parseFloat(targetValue).toFixed(1);
               angle.dispatchEvent(event);
            });
            this.classList.add('active');
          }else{
            const selector = `.presetBtn:not(#enregBtn):not(#${this.id})`;
            document.querySelectorAll(selector).forEach(btn => btn.classList.remove('active'));
            this.classList.toggle('active');
            const enregButton = document.getElementById('enregBtn');
            if(this.classList.contains('active')){
              enregButton.textContent = 'Valider';
              enregButton.classList.add('enregPret');
              enregButton.classList.remove('enregPasPret');
            }else{
              enregButton.textContent = 'Annuler';
              enregButton.classList.remove('enregPret');
              enregButton.classList.add('enregPasPret');
            }
          }  
      });
    }
      


     // Création du bouton pour enregistrer le mouvement
     const enregButton = document.createElement('button');
     enregButton.className = 'presetBtn';
     enregButton.id = 'enregBtn';
     enregButton.textContent = 'Enregistrer';
     presetSection.appendChild(enregButton);

    
    // Ajout d'un écouteur d'événement sur le bouton d'enregistrement
    enregButton.addEventListener('click', function() {


      if (!isRecording) {
        isRecording = true;
        enregButton.classList.add('enregPasPret');
        enregButton.textContent = 'Annuler';
        document.querySelectorAll('.presetBtn:not(#enregBtn)').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.presetBtn:not(#enregBtn)').forEach(btn => btn.classList.add('modifierBtn'));
      } else {      
        enregButton.textContent = 'Enregistrer';
        isRecording = false;
        document.querySelectorAll('.presetBtn').forEach(btn => btn.classList.remove('modifierBtn'));
        if(enregButton.classList.contains('enregPasPret')){
          document.querySelectorAll('.presetBtn:not(#enregBtn)').forEach(btn => btn.classList.remove('active'));
          enregButton.classList.remove('enregPasPret');
        }else{

          console.log(mvtEnregistre);

          document.querySelectorAll('.presetBtn:not(#enregBtn).active').forEach(btn => {
          position = parseInt(btn.id.replace('preset', ''));
          btn.classList.remove('active'); } );

          motorInfo.forEach(motor => {
            var id = parseInt(motor.id);
            mvtEnregistre[position].left[id] = parseFloat(sliderValuesLeft[id]);
            mvtEnregistre[position].right[id] = parseFloat(sliderValuesRight[id]);
          });
          console.log(mvtEnregistre);
          enregButton.classList.remove('enregPret');
        }
      }
    });
  }
