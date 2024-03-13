// joystick.js
// Gestion du joystick permettant le déplacement du robot
// Par Nathan TASTET - 2023

// --- IMPORT ---

import {updateMotorValues} from './websocket.js';


// --- VARIABLES ---

let joystickIsDragging = false;
let leftMotor = 0;
let rightMotor = 0;


// --- CONSTANTES ---

const anglemort = 0.2;
const container = document.getElementById('joystickControls2');
const base = document.getElementById('joystickBase');
const handle = document.getElementById('joystickHandle');


// --- FONCTIONS ---

// Initialiser et configurer le joystick
export function setupJoystick() {
    
    container.addEventListener('mousedown', startGrab);
    container.addEventListener('touchstart', startGrab, { passive: false });
    document.addEventListener('mousemove', moveJoystick);
    document.addEventListener('touchmove', moveJoystick, { passive: false });
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    // On ajoute les encoches sur le joystick
    const parentElement = document.querySelector('#joystickBase'); // Remplace '#parentElement' par le sélecteur approprié

    // Crée et insère les éléments
    for (let i = 0; i <= 360; i += 45) {
        const notch = document.createElement('div');
        notch.className = 'notch';
        notch.style.transform = `rotate(${i}deg)`;
        const notchInner = document.createElement('div');
        notchInner.className = 'notch-inner';
        notch.appendChild(notchInner);
        parentElement.appendChild(notch);
    }
}


function startGrab(e) {
    e.preventDefault(); // Empêcher le comportement par défaut sur les tablettes
    container.style.cursor = "grabbing";
    joystickIsDragging = true;
}


function moveJoystick(e) {

    if (!joystickIsDragging) return;


    e.preventDefault(); // Empêcher le comportement par défaut sur les tablettes

    // on détecte les positions x et y du joystick
    let clientX, clientY;
    if (e.touches) { // Si c'est un événement tactile
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else { // Si c'est un événement de souris
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const rect = base.getBoundingClientRect();
    let x = clientX - rect.left - rect.width / 2;
    let y = clientY - rect.top - rect.height / 2;

    // Calculer les nouvelles positions
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = rect.width / 2;

    // Restreindre les déplacements
    if (distance > maxDistance) {
        x *= maxDistance / distance;
        y *= maxDistance / distance;
    }

    handle.style.left = `${x + maxDistance}px`;
    handle.style.top = `${y + maxDistance}px`;

    // Afficher les coordonnées
    afficherCoordonnees(x, y, maxDistance);
}


function endDrag() {
    container.style.cursor = "default";
    joystickIsDragging = false;

    //Retour à la base si on lâche
    const returnToCenter = () => {
        if (joystickIsDragging) return;

        var x = parseFloat(handle.style.left);
        var y = parseFloat(handle.style.top);
        const maxDistance = base.getBoundingClientRect().width / 2;

        if (x === maxDistance && y === maxDistance) return;

        handle.style.left = `${x + (maxDistance - x) * 0.1}px`;
        handle.style.top = `${y + (maxDistance - y) * 0.1}px`;

        requestAnimationFrame(returnToCenter);
        x = x - maxDistance;
        y = y - maxDistance;
        afficherCoordonnees(x, y, maxDistance);
    };

    returnToCenter();
}


export function afficherCoordonnees(x, y, maxDistance) {
    // Normalisation des distances x et y : conversion en un ratio compris entre 0 et 1
    const normalizedX = x / maxDistance;
    const normalizedY = y / maxDistance; // l'axe y est a l'endroit

    if (Math.abs(normalizedX) < anglemort && Math.abs(normalizedY) < anglemort) {
        // on est dans l'angle mort, tout est nul.
        leftMotor = 0;
        rightMotor = 0;
    }
    else {
        // Calcul de la puissance de chaque moteur
        leftMotor = normalizedY + normalizedX;
        rightMotor = normalizedY - normalizedX;
        leftMotor = Math.max(-1, Math.min(1, leftMotor)) * 100;
        rightMotor = Math.max(-1, Math.min(1, rightMotor)) * 100;
        leftMotor = parseFloat(leftMotor).toFixed(1);
        rightMotor = -parseFloat(rightMotor).toFixed(1);
    }
    // Affichage
    const joystickXValue = document.getElementById('joystickXValue');
    const joystickYValue = document.getElementById('joystickYValue');
    const leftMotorValue = document.getElementById('leftMotorValue');
    const rightMotorValue = document.getElementById('rightMotorValue');

    joystickXValue.textContent = x.toFixed(1); // Afficher la valeur de X
    joystickYValue.textContent = y.toFixed(1); // Afficher la valeur de Y
    leftMotorValue.textContent = leftMotor; // Afficher la valeur du moteur gauche
    rightMotorValue.textContent = rightMotor; // Afficher la valeur du moteur droit
    updateMotorValues(leftMotor,rightMotor);
}
