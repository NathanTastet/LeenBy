// sliderControl.js
// Gère les sliders pour le contrôle des moteurs dans l'interface utilisateur.
// Par Nathan TASTET - 2023


// ---- VARIABLES ----
import { modeBras } from './buttonControl.js';
import { motorInfo } from './motorInfo.js';
import { isRecording } from './presetButtons.js';
import { update3d } from './vue3d.js';

export let sliderValuesLeft = {};
export let sliderValuesRight = {};

// ---- FONCTIONS ----

// Configure les sliders pour chaque moteur et les ajoute à la table des sliders.
export function setupMotorSliders() {
    const table = document.getElementById("table-sliders");
    while (table.children.length > 2) {
        table.deleteRow(table.rows.length - 1);
    }
    motorInfo.forEach(motor => {
        addMotorRowToTable(table, motor);
        sliderValuesLeft[motor.id] = 0; // Valeur par défaut pour le bras gauche
        sliderValuesRight[motor.id] = 0; // Valeur par défaut pour le bras droit
    });
    

}


// Ajoute une ligne à la table des sliders pour un moteur spécifique.
function addMotorRowToTable(table, motor) {
    const row = table.insertRow(table.rows.length - 1);
    row.classList.add('slider-container');

    // Colonne du nom de l'angle
    const nameCell = row.insertCell(0);
    nameCell.textContent = `${motor.name}`;
    nameCell.classList.add('col1');

    // Colonne de l'id de l'angle
    const idCell = row.insertCell(1);
    idCell.innerHTML = `<div id="angle-text-left${motor.id}">0.0°</div>`;
    idCell.classList.add('col2');

    // Colonne pour le texte de l'angle
    const textCell = row.insertCell(2);
    textCell.innerHTML = `<div id="angle-text-right${motor.id}">0.0°</div>`;
    textCell.classList.add('col3');

    // Colonne pour le curseur de l'angle
    const sliderCell = row.insertCell(3);
    sliderCell.innerHTML = `<input type="range" id="angle-slider${motor.id}" data-motor-id="${motor.id}" min="${motor.minAngle}" max="${motor.maxAngle}"
    value="0" step="0.1">`;
    sliderCell.classList.add('col4');

    // Colonne pour le numéro de l'angle
    const numberCell = row.insertCell(4);
    numberCell.innerHTML = `<input type="number" id="angle-number${motor.id}" min="${motor.minAngle}" max="${motor.maxAngle}" value="0" step="0.1">`;
    numberCell.classList.add('col5');

    // Configuration des écouteurs d'événements
    setupSliderEventListeners(motor);
}


// Configure les écouteurs d'événements pour les sliders de chaque moteur.
export function setupSliderEventListeners(motor) {
    const slider = document.getElementById(`angle-slider${motor.id}`);
    const angle = document.getElementById(`angle-number${motor.id}`);
    const texte_gauche = document.getElementById(`angle-text-left${motor.id}`);
    const texte_droite = document.getElementById(`angle-text-right${motor.id}`);

    slider.dataset.isDragging = 0;

    slider.addEventListener("mousedown", (e) => startDragSlider(e, slider, angle, texte_gauche, texte_droite));
    slider.addEventListener("touchstart", (e) => startDragSlider(e, slider, angle, texte_gauche, texte_droite));

    slider.addEventListener("mousemove", (e) => moveDragSlider(e, slider, angle, texte_gauche, texte_droite));
    slider.addEventListener("touchmove", (e) => moveDragSlider(e, slider, angle, texte_gauche, texte_droite));

    slider.addEventListener("mouseup", () => stopDragSlider(slider));
    slider.addEventListener("mouseleave", () => stopDragSlider(slider));
    slider.addEventListener("touchend", () => stopDragSlider(slider));

    angle.addEventListener("input", () => {
        if(isRecording){
            document.querySelectorAll('.presetBtn:not(#enregBtn)').forEach(btn => btn.classList.remove('active'));
        }
        adjustSliderValue(angle, slider);
        adjustText(slider,texte_gauche, texte_droite);
        update3d();
        updateSliderStyle(slider);
    });
}



// Démarre le glissement du slider.
function startDragSlider(e, slider, angle, texte_gauche, texte_droite) {
    slider.dataset.isDragging = 1;
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateSliderAndAngle(slider, angle, clientX);
    if(texte_gauche)adjustText(slider,texte_gauche, texte_droite);
    else updateSliderStyleVit(slider);
    if(!isRecording){
        document.querySelectorAll('.presetBtn:not(#enregBtn)').forEach(btn => btn.classList.remove('active'));
    }
}


// Déplace le slider lors du glissement.
function moveDragSlider(e, slider, angle, texte_gauche, texte_droite) {
    if (slider.dataset.isDragging == 1) {
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        updateSliderAndAngle(slider, angle, clientX);
        if(texte_gauche)adjustText(slider,texte_gauche, texte_droite);
        else updateSliderStyleVit(slider);
    }
}


// Arrête le glissement du slider.
function stopDragSlider(slider) {
    slider.dataset.isDragging = 0;
    if(slider.id == 'vit_bras_slider') {
        // Aimante la valeur du slider au modulo 25 avec une animation
        const sliderValue = parseInt(slider.value);
        const magnetizedValue = Math.round((sliderValue+50) / 25) * 25 - 50;
        animateSliderValue(slider, magnetizedValue);
    }
}

// Anime la valeur du slider jusqu'à la valeur aimantée
let animationFrame;

let isAnimating = false; // Ajoutez cette variable pour suivre l'état de l'animation

export function animateSliderValue(slider, targetValue) {
    if (isAnimating) {
        return; // If animation is already in progress, do nothing
    }

    isAnimating = true; // Set animation state to true

    const animationDuration = 200; // Animation duration in milliseconds
    const initialValue = parseInt(slider.value);
    const valueChangePerFrame = (targetValue - initialValue) / (animationDuration / 16); // 16ms per frame (60fps)

    let currentValue = initialValue;

    function updateValue() {
        currentValue += valueChangePerFrame;
        if ((valueChangePerFrame > 0 && currentValue >= targetValue) || (valueChangePerFrame < 0 && currentValue <= targetValue)) {
            currentValue = targetValue;
            cancelAnimationFrame(animationFrame);
            isAnimating = false; // Reset animation state to false
        } else if (Math.abs(currentValue - targetValue) < 0.1) {
            currentValue = targetValue;
            cancelAnimationFrame(animationFrame);
            isAnimating = false; // Reset animation state to false
        } else {
            animationFrame = requestAnimationFrame(updateValue);
        }
        slider.value = Math.round(currentValue);
        updateSliderStyleVit(slider);
    }

    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    animationFrame = requestAnimationFrame(updateValue);
}

// Met à jour le style du slider en fonction de sa valeur.
export function updateSliderStyle(sliderElement) {
    let percentage = (((sliderElement.value) / (sliderElement.max - sliderElement.min)) * 100.0) + 50; 

    if (percentage > 50) {
        sliderElement.style.background = 
        'linear-gradient(90deg, #a0a0a0 0%, #a0a0a0 50%, #56d8d8 50%, #56d8d8 ' + percentage + '%, #a0a0a0 ' + percentage + '%)';
    } else {
        sliderElement.style.background = 
        'linear-gradient(90deg, #a0a0a0 0%, #a0a0a0 ' + percentage + '%, #56d8d8 ' + percentage + '%, #56d8d8 50%, #a0a0a0 50%, #a0a0a0 100%)';
    }
}

// updateSliderStyleVit est la même fonction que updateSliderStyle mais pour le slider de vitesse

export function updateSliderStyleVit(sliderElement) {
    const minSpeed = sliderElement.min;
    const maxSpeed = sliderElement.max;
    const speed = sliderElement.value;

    // Calculer la valeur normalisée de la vitesse entre 0 et 1
    const normalizedSpeed = (speed - minSpeed) / (maxSpeed - minSpeed);

    // Utiliser l'échelle de couleurs pour mapper la valeur normalisée à une couleur
    const color = getColorFromScale(normalizedSpeed);

    // Appliquer la couleur au fond du slider
    sliderElement.style.background = `linear-gradient(90deg, ${color} 0%, ${color} ${normalizedSpeed * 100}%, #ddd ${normalizedSpeed * 100}%, #ddd 100%)`;

    // Appliquer la couleur au thumb du slider
    document.documentElement.style.setProperty('--thumb-color', color);}

// Fonction pour mapper une valeur normalisée à une couleur entre le vert et le rouge
function getColorFromScale(value) {
    const hue = (1 - value) * 120; // Convertir la valeur en teinte entre 0 et 120 (vert à rouge)
    return `hsl(${hue}, 100%, 50%)`; // Utiliser HSL pour définir la couleur en fonction de la teinte
}


// Met à jour le slider et l'angle en fonction de la position de la souris.
export function updateSliderAndAngle(slider, angle, clientX) {
    const rect = slider.getBoundingClientRect();
    const x = clientX !== null ? clientX - rect.left : null;
    const width = rect.right - rect.left;
    const value = x !== null ? (x / width) * (slider.max - slider.min) - slider.max : parseFloat(angle.value);
  
    if (value < slider.min) {
      slider.value = slider.min;
      if(angle)angle.value = slider.min;
    } else if (value > slider.max) {
      slider.value = slider.max;
      if(angle)angle.value = slider.max;
    } else {
      slider.value = value.toFixed(1);
      if(angle)angle.value = value.toFixed(1);
    }

    update3d();
    if(angle)updateSliderStyle(slider);

}



// Ajuste la valeur du slider en fonction des entrées de l'angle.
function adjustSliderValue(angle, slider) {
    let min= parseFloat(angle.min);
    let max = parseFloat(angle.max);
    if (min <= angle.value && angle.value <= max) {
        slider.value = angle.value;
    } else if (min > angle.value) {
        slider.value = min;
        angle.value = min;
    } else if (angle.value > max) {
        slider.value = max;
        angle.value = max;
    }
}

// fonction qui met a jour les textes de l'angle d'un slider, et le tableau slider
export function adjustText(slider, texte_gauche, texte_droite) {

    let motorId = parseInt(slider.dataset.motorId);

    switch (modeBras) {
        case 'brasGauche':
            sliderValuesLeft[motorId] = slider.value;
            texte_gauche.textContent = parseFloat(slider.value).toFixed(1) + '°';
            break;
        case 'brasDroit':
            sliderValuesRight[motorId] = slider.value;
            texte_droite.textContent = parseFloat(slider.value).toFixed(1) + '°';
            break;
        case 'deuxBras':
            sliderValuesLeft[motorId] = slider.value;
            sliderValuesRight[motorId] = slider.value;
            texte_gauche.textContent = parseFloat(slider.value).toFixed(1) + '°';
            texte_droite.textContent = parseFloat(slider.value).toFixed(1) + '°';
            break;
    }
}

// fonction qui met a jour les textes quand on change de bras
export function changerBras() {
    motorInfo.forEach(motor => {
        const slider = document.getElementById(`angle-slider${motor.id}`);
        const angleNumber = document.getElementById(`angle-number${motor.id}`);

        let newValue;
        switch (modeBras) {
            case 'brasGauche':
                newValue = parseFloat(sliderValuesLeft[motor.id]);
                break;
            case 'brasDroit':
                newValue = parseFloat(sliderValuesRight[motor.id]);
                break;
            case 'deuxBras':
                if(parseFloat(sliderValuesLeft[motor.id]) == parseFloat(sliderValuesRight[motor.id])){
                newValue = parseFloat(sliderValuesLeft[motor.id]);
                }
                else{  
                    newValue = 0;
                }
                break;
        }

        // Mettre à jour les sliders et leurs valeurs associées
        slider.value = newValue;
        angleNumber.value = newValue;
        updateSliderStyle(slider);
    });
}

// Configure le slider de vitesse
export function setupSpeedSlider() {


    const sliderVit = document.getElementById('vit_bras_slider');

    sliderVit.value = 0;
    // changer le style 
    updateSliderStyleVit(sliderVit);

    sliderVit.addEventListener("mousedown", (e) => startDragSlider(e, sliderVit));
    sliderVit.addEventListener("touchstart", (e) => startDragSlider(e, sliderVit));

    sliderVit.addEventListener("mousemove", (e) => moveDragSlider(e, sliderVit));
    sliderVit.addEventListener("touchmove", (e) => moveDragSlider(e, sliderVit));

    sliderVit.addEventListener("mouseup", () => stopDragSlider(sliderVit));
    sliderVit.addEventListener("mouseleave", () => stopDragSlider(sliderVit));
    sliderVit.addEventListener("touchend", () => stopDragSlider(sliderVit));
}