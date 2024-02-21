// presetButtons.js
// Boutons pour enregistrer et exécuter des mouvements
// Par Nathan TASTET - 2024

// ---- IMPORTS ----

import { sliderValuesLeft, sliderValuesRight } from './sliderControl.js';
import { motorInfo } from './motorInfo.js';
import { modeBras } from './buttonControl.js';
// ---- VARIABLES ----

export var mvtEnregistre = [];
var position = 0;
let targetValue = 0;


export var isRecording = false;

// ---- FONCTIONS ----

// Initailise la popup

export function setupPopup() {

  const choixImage = document.getElementById('choixImage');

  for (let i = 1; i <= 15; i++) {
      const button = document.createElement('button');
      button.className = 'choixImageBtn';
      button.id = `img${i}`;
      button.innerHTML = `<img src="img/preset/img${i}.svg"></span>`;
      button.type = "submit"
      choixImage.appendChild(button);
  }
}

// Initialise les boutons de presets
export function setupPresetButtons() {

    const presetSection = document.getElementById('presetSection');

    //on initialise le tableau de mouvements avec des cases vides
    for (let i = 1; i <= 7; i++) {
      mvtEnregistre[i] = {left: [], right: []};
      // on sort les valeurs du tableau des données locales
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
            if(mvtEnregistre[i].left[0] == 1){
              document.querySelectorAll('.presetBtn:not(#enregBtn)').forEach(btn => btn.classList.remove('active'));
              
              // on ne peut pas enregistrer ni charger un preset si on est en mode deux bras
              if(modeBras == 'deuxBras'){
                let button2 = document.getElementById('brasGauche');
                button2.click();
              }

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
            }
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

    // si le tableau de mouvements enregistrés existe, on le récupère et on l'affiche
    if(JSON.parse(localStorage.getItem('mvtEnregistre')) != null){
      mvtEnregistre = JSON.parse(localStorage.getItem('mvtEnregistre'));
      for (let i = 1; i <= 7; i++) {
        if(mvtEnregistre[i].left[0] == 1){
          let button = document.getElementById(`preset${i}`);
          let choixImage = JSON.parse(localStorage.getItem(`choixImage${i}`));
          let nomPreset = JSON.parse(localStorage.getItem(`nomPreset${i}`));
          button.innerHTML = `<span class="btnText">${nomPreset}</span><img class="btnIcon" src="img/preset/${choixImage}.svg"></span>`;
          button.classList.add('DonneesEnregistrees');
        }
      }
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

          document.querySelectorAll('.presetBtn:not(#enregBtn).active').forEach(btn => {
          position = parseInt(btn.id.replace('preset', ''));
          btn.classList.remove('active'); } );
          
          // on affiche une popup avec un formulaire pour choisir une image et un nom 


          document.getElementById("formulaire").reset();
          document.getElementById("popup").style.display = "flex";
          
          
          function soumettreFormulaire(event){
            event.preventDefault(); // Empêche le comportement par défaut du formulaire (rechargement de la page)

            if (this.checkValidity()) {
              // on indique que la position a été bien enregistrée puis on met les valeurs dans le tableau
              mvtEnregistre[position].left[0] = 1;
              motorInfo.forEach(motor => {
                var id = parseInt(motor.id);
                mvtEnregistre[position].left[id] = parseFloat(sliderValuesLeft[id]);
                mvtEnregistre[position].right[id] = parseFloat(sliderValuesRight[id]);
              });
              let preBut = document.getElementById(`preset${position}`);
              preBut.classList.add('DonneesEnregistrees');
            
              enregButton.classList.remove('enregPret');

              // on récupère les valeurs du formulaire
              var nom = document.getElementById("nomPreset").value;
              var choiximage = event.submitter.id;

              // on met les valeurs de nom et d'image
              preBut.innerHTML = `<span class="btnText">${nom}</span><img class="btnIcon" src="img/preset/${choiximage}.svg"></span>`;
              document.getElementById("formulaire").removeEventListener("submit", soumettreFormulaire);
              document.getElementById("popup").style.display = "none";

              // on enregistre en local
              // on met le mouvement enregistré dans le local storage
              localStorage.setItem('mvtEnregistre', JSON.stringify(mvtEnregistre));
              // on met l'icone choisie aussi
              localStorage.setItem(`choixImage${position}`, JSON.stringify(choiximage));
              // on met le nom du preset aussi
              localStorage.setItem(`nomPreset${position}`, JSON.stringify(nom));
            }
          }
          // il faut attendre la réponse du formulaire pour continuer
          document.getElementById("formulaire").addEventListener("submit", soumettreFormulaire);
        }
      }
    });      
}



