// sliderControl.js
// Gère les sliders pour le contrôle des moteurs dans l'interface utilisateur.
// Par Nathan TASTET - 2023


// ---- VARIABLES ----
import { motorInfo } from './motorInfo.js';
import { update3d } from './vue3d.js';


// ---- FONCTIONS ----

// Configure les sliders pour chaque moteur et les ajoute à la table des sliders.
export function setupMotorSliders() {
    const table = document.getElementById("table-sliders");
    while (table.children.length > 2) {
        table.deleteRow(table.rows.length - 1);
    }
    motorInfo.forEach(motor => {
        addMotorRowToTable(table, motor);
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
    idCell.textContent = `${motor.id}`;
    idCell.classList.add('col2');

    // Colonne pour le texte de l'angle
    const textCell = row.insertCell(2);
    textCell.innerHTML = `<div id="angle-text${motor.id}">0.0°</div>`;
    textCell.classList.add('col3');

    // Colonne pour le curseur de l'angle
    const sliderCell = row.insertCell(3);
    sliderCell.innerHTML = `<input type="range" id="angle-slider${motor.id}" min="${motor.minAngle}" max="${motor.maxAngle}" value="0" step="0.1">`;
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
    const texte = document.getElementById(`angle-text${motor.id}`);

    slider.dataset.isDragging = 0;

    slider.addEventListener("mousedown", (e) => startDragSlider(e, slider, angle, texte));
    slider.addEventListener("touchstart", (e) => startDragSlider(e, slider, angle, texte));

    slider.addEventListener("mousemove", (e) => moveDragSlider(e, slider, angle, texte));
    slider.addEventListener("touchmove", (e) => moveDragSlider(e, slider, angle, texte));

    slider.addEventListener("mouseup", () => stopDragSlider(slider));
    slider.addEventListener("mouseleave", () => stopDragSlider(slider));
    slider.addEventListener("touchend", () => stopDragSlider(slider));

    angle.addEventListener("input", () => {
        adjustSliderValue(angle, slider);
        texte.textContent = `${parseFloat(slider.value).toFixed(1)}°`;
        update3d(slider);
        updateSliderStyle(slider);
    });
}

// Démarre le glissement du slider.
function startDragSlider(e, slider, angle, texte) {
    slider.dataset.isDragging = 1;
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    texte.textContent = `${parseFloat(updateSliderAndAngle(slider, angle, clientX)).toFixed(1)}°`;
}


// Déplace le slider lors du glissement.
function moveDragSlider(e, slider, angle, texte) {
    if (slider.dataset.isDragging == 1) {
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        texte.textContent = `${parseFloat(updateSliderAndAngle(slider, angle, clientX)).toFixed(1)}°`;
    }
}


// Arrête le glissement du slider.
function stopDragSlider(slider) {
    slider.dataset.isDragging = 0;
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


// Met à jour le slider et l'angle en fonction de la position de la souris.
export function updateSliderAndAngle(slider, angle, clientX) {
    const rect = slider.getBoundingClientRect();
    const x = clientX !== null ? clientX - rect.left : null;
    const width = rect.right - rect.left;
    const value = x !== null ? (x / width) * (slider.max - slider.min) - slider.max : parseFloat(angle.value);
  
    if (value < slider.min) {
      slider.value = slider.min;
      angle.value = slider.min;
    } else if (value > slider.max) {
      slider.value = slider.max;
      angle.value = slider.max;
    } else {
      slider.value = value.toFixed(1);
      angle.value = value.toFixed(1);
    }
    update3d(slider);
    updateSliderStyle(slider);
    return slider.value;
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
