// joystick.js
// Gestion des options
// Par Nathan TASTET - 2023

import { modeBras, changermodeBras } from "./buttonControl.js";

let clickCount = 0;

export function setupOptions() {

    let selectPolice = document.getElementById("optChangerPolice");

    // pour chaque option de police, l'afficher avec la police correspondante
    for (let i = 0; i < selectPolice.options.length; i++) {
        let option = selectPolice.options[i];
        let police = option.value;
        option.style.fontFamily = police;
    }
    
    if(localStorage.getItem("police")){
        let police = localStorage.getItem("police");
        document.documentElement.style.setProperty('--font', police);
        selectPolice.value = police;
    }
    
    // changer la police
    selectPolice.addEventListener("change", function() {
        let police = selectPolice.value;
        document.documentElement.style.setProperty('--font', police);
        localStorage.setItem("police", police);
    });

    let viderPresets = document.getElementById("ViderPreset");
    // si on clique une fois sur le bouton, on affiche un message de confirmation
    // si on clique une deuxième fois, on vide les presets

    clickCount = 0;
    viderPresets.addEventListener("click", function() {
        clickCount++;
        if (clickCount == 1) {
            viderPresets.innerHTML = "Êtes-vous sûr ?";
        } else {
            localStorage.removeItem('mvtEnregistre');
            localStorage.removeItem('choixImage1');
            localStorage.removeItem('choixImage2');
            localStorage.removeItem('choixImage3');
            localStorage.removeItem('choixImage4');
            localStorage.removeItem('choixImage5');
            localStorage.removeItem('choixImage6');
            localStorage.removeItem('choixImage7');
            location.reload();
        }
    });

    // inverser gauche et droite

    let optInvertGD = document.getElementById("optInvertGD");
    // charger les options sauvegardées
    if(localStorage.getItem('optInvertGD') == "true"){
        switchBras();
        optInvertGD.checked = true;
    }

    // fonction pour retouner le robot : inverser gauche et droite
    optInvertGD.addEventListener("click", function() {
        if (optInvertGD.checked) {
            localStorage.setItem('optInvertGD', "true");
            switchBras();
        } else {
            switchBras();
            localStorage.setItem('optInvertGD', "false");
        }
    });
}


function switchBras(){
     // on va changer d'id le boutons gauche et droite
     let boutonGauche = document.getElementById("brasGauche");
     let boutonDroit = document.getElementById("brasDroit");

     boutonGauche.id = "brasDroit";
     boutonDroit.id = "brasGauche";

     if(modeBras == "brasGauche"){
         changermodeBras("brasDroit");
     }
     else if(modeBras == "brasDroit"){
        changermodeBras("brasGauche");
     }
     // on reclique sur le bouton actif
     document.getElementById(modeBras).click();
}

export function resetClickCount() {
    clickCount = 0;
    document.getElementById("ViderPreset").innerHTML = "Vider les presets";
}