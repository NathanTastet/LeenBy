// websocket.js
// Ce fichier gère la connexion WebSocket pour l'envoi et la réception de données 
// relatives aux moteurs et autres commandes de l'application.
// Par Nathan TASTET - 2023


// ---- VARIABLES ----

// Établit la connexion WebSocket.
let socket = new WebSocket("ws://192.168.4.1:8080");

// Gère les états des moteurs pour les déplacements.
let leftMotor = 0;
let rightMotor = 0;
let oldLeftMotor = null;
let oldRightMotor = null;


// ---- CONSTANTES ----

// Seuil de différence pour l'envoi des données des moteurs.
const seuil_different = 5;

// Délai entre les envois de données des moteurs (en millisecondes).
const delai_envoi = 500;


// ---- FONCTIONS ----

// Gère l'ouverture de la connexion WebSocket et envoie périodiquement les données des moteurs.
socket.onopen = function (e) {
    console.log("Connection WebSocket établie");
    setInterval(() => {
        if (Math.abs(leftMotor - oldLeftMotor) > seuil_different ||
            Math.abs(rightMotor - oldRightMotor) > seuil_different) {
            if (socket.readyState) {
                socket.send(JSON.stringify({ leftMotor, rightMotor }));
            }
            oldLeftMotor = leftMotor;
            oldRightMotor = rightMotor;
        }
    }, delai_envoi);
};


// Gère la réception de messages via WebSocket.
socket.onmessage = function (event) {
    document.getElementById("infoTexte").textContent = 'Message reçu : ' + event.data;
};


// Met à jour les valeurs des moteurs et les envoie si nécessaire via le setInterval ci-dessus
export function updateMotorValues(newLeftMotor, newRightMotor) {
    leftMotor = newLeftMotor;
    rightMotor = newRightMotor;
}


// Envoie les informations des angles des moteurs via WebSocket.
export function sendAnglesInfo(anglesInfo) {
    if (socket.readyState) {
        socket.send(JSON.stringify({ anglesInfo }));
    }
}
