
/* 
  popup.css
  Auteur: Nathan TASTET - 2024
  Gestion des popups: 
  - formulaire qui s'affiche lorsque l'utilisateur enregistre un preset
  - popup d'options
  - popup d'aide
*/

import { changerBoutonEnreg } from './presetButtons.js';

var formulaire = null;

// Initailise les popups
export function setupPopups() {
    setupPopupEnregistrerPreset();
    setupPopup('settingsButton', 'popupOptions', 'closePopupOptions');
    setupPopup('infoButton', 'popupAide', 'closePopupAide');
}

// initialise la popup de formulaire pour enregistrer un preset

function setupPopupEnregistrerPreset() {
    formulaire = document.getElementById("formulaire");

    const choixImage = document.getElementById('choixImage');

    // on crée les boutons pour choisir l'image

    for (let i = 1; i <= 15; i++) {
        const button = document.createElement('button');
        button.className = 'choixImageBtn';
        button.id = `img${i}`;
        button.innerHTML = `<img src="img/preset/img${i}.svg"></span>`;
        button.type = "submit";
        choixImage.appendChild(button);
    }

    // listener pour quitter la popup si on clique sur la croix

    const popupCroix = document.getElementById('closePopupForm');
    popupCroix.addEventListener('click', function (event) {
        if (event.target == popupCroix) {
            document.getElementById("popup1").style.display = "none";
            const submitListener = formulaire.__eventListeners && formulaire.__eventListeners.find(listener => listener.type === "submit");
            if (submitListener) {
                formulaire.removeEventListener("submit", submitListener.listener);
            }
            changerBoutonEnreg('enregistrer');

        }
    });
}


// initialise la popup d'options / d'aide
function setupPopup(nomBoutonOuvrir, nomPopup, nomBoutonFermer) {
    const boutonOuvrir = document.getElementById(nomBoutonOuvrir);
    boutonOuvrir.addEventListener('click', function(event) {
        if (event.target == boutonOuvrir) {
            document.getElementById(nomPopup).style.display = "flex";
        }
    });

    const boutonFermer = document.getElementById(nomBoutonFermer);
    boutonFermer.addEventListener('click', function(event) {
        if (event.target == boutonFermer) {
            document.getElementById(nomPopup).style.display = "none";
        }
    });
}
