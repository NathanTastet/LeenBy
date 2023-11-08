// table d'informations moteurs éditable en fonction des besoins
const motorInfo = [
  { id: 1, name: 'Rotation Épaule', minAngle: -159.6, maxAngle: 159.6 },
  { id: 2, name: 'Pliage épaule', minAngle: -159.6, maxAngle: 159.6 },
  { id: 3, name: 'Rotation coude', minAngle: -159.6, maxAngle: 159.6 },
  { id: 4, name: 'Pliage coude', minAngle: -159.6, maxAngle: 159.6 },
  { id: 5, name: 'Rotation main', minAngle: -159.8, maxAngle: 159.8 },
  { id: 6, name: 'Pliage main', minAngle: -159.8, maxAngle: 159.8 },
  { id: 7, name: 'Pliage Pouce', minAngle: -159.8, maxAngle: 159.8 }
];

// créer un socket de données
let socket = new WebSocket("ws://192.168.4.1:8080");

let leftMotor = 0;
let rightMotor = 0;
let oldLeftMotor = null;
let oldRightMotor = null;

const anglemort = 0.2; // zone d'angle mort à ajuster
const seuil_different = 5 ; //seuil de différence entre 2 valeurs

socket.onopen = function(e) {
  console.log("Connection ws établie");
  setInterval(() => {
    if (Math.abs(leftMotor - oldLeftMotor) > seuil_different || Math.abs(rightMotor - oldRightMotor) > seuil_different) {
      if(socket.readyState){
        socket.send(JSON.stringify({ leftMotor: leftMotor, rightMotor: rightMotor }));
      }
      oldLeftMotor = leftMotor;
      oldRightMotor = rightMotor;
    }
  }, 250); 
}


socket.onmessage = function(event) {
  document.getElementById("infoTexte").textContent = 'Message reçu : ' + event.data;
};

// Fonction de setup
function setup() {
  const table = document.getElementById("table-sliders"); // Assurez-vous que votre table a un ID ou une classe spécifique si nécessaire

  // Videz la table actuelle, à l'exception de la dernière ligne pour les boutons
  while (table.children.length > 2) {
    table.deleteRow(table.rows.length - 1);
  }

  // Créer une ligne de table pour chaque moteur et configurer les sliders, angles , .. . 
  motorInfo.forEach(motor => {

    const indexLigne = table.rows.length - 1;
    const row = table.insertRow(indexLigne); // Insérer une nouvelle ligne
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
    
    // Configurer le reste
    let texte = document.getElementById(`angle-text${motor.id}`);
    let slider = document.getElementById(`angle-slider${motor.id}`);
    let angle = document.getElementById(`angle-number${motor.id}`);

    slider.dataset.isDragging = 0;
    
    slider.addEventListener("mousedown", startDragSlider);
    slider.addEventListener("touchstart", startDragSlider);

    slider.addEventListener("mousemove", moveDragSlider);
    slider.addEventListener("touchmove", moveDragSlider);
    
    slider.addEventListener("mouseup", stopDragSlider);
    slider.addEventListener("mouseleave", stopDragSlider);
    slider.addEventListener("touchend", stopDragSlider);
    
    function startDragSlider(e) {
      slider.dataset.isDragging = 1;
      let clientX = e.touches ? e.touches[0].clientX : e.clientX; // choix de gauche si event tactile ou choix de droite si event souris
      texte.textContent = `${parseFloat(updateSliderAndAngle(slider, angle, clientX)).toFixed(1)}°`;
    }
    
    function moveDragSlider(e) {
      if (slider.dataset.isDragging == 1) {
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        texte.textContent = `${parseFloat(updateSliderAndAngle(slider, angle, clientX)).toFixed(1)}°`;
      }
    }
    
    function stopDragSlider(){
      slider.dataset.isDragging = 0;
    }

    angle.addEventListener("input", function() {
      if(angle.min <= angle.value & angle.value<= angle.max){
        slider.value = angle.value;
      }
      if(angle.min > angle.value){
        slider.value = angle.min;
      }
      if(angle.value > angle.max){
        slider.value = angle.max;
      }
      texte.textContent = `${parseFloat(slider.value).toFixed(1)}°`;
      updateSliderStyle(slider);
    });
  });

  document.getElementById("reset_button").addEventListener("click", remiseazero);
  document.getElementById("check_button").addEventListener("click", validerAngles);
}

// mise a jour du remplissage du slider
function updateSliderStyle(sliderElement) {
  // Convertis la valeur de min, max en pourcentage 0-100
  let percentage = (((sliderElement.value) / (sliderElement.max - sliderElement.min)) * 100.0) + 50; 
  sliderElement.style.setProperty('--value', percentage + '%');
}

//fonction de remise à zéro
function remiseazero() {
  motorInfo.forEach(motor => {
    
    let texte = document.getElementById(`angle-text${motor.id}`);
    let slider = document.getElementById(`angle-slider${motor.id}`);
    let angle = document.getElementById(`angle-number${motor.id}`);
    texte.textContent = '0.0°';
    slider.value = 0;
    angle.value = 0;
    updateSliderStyle(slider);
  });
}

function validerAngles(){
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

  if(socket.readyState){
      socket.send(JSON.stringify({anglesInfo}));
  }
}

function updateSliderAndAngle(slider, angle, clientX) {
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
  updateSliderStyle(slider);
  return slider.value;
}


document.addEventListener("DOMContentLoaded", function() {
  setup();
  remiseazero();

  // gestions des boutons haut gauche
  const armButtons = document.querySelectorAll(".armButton");

  armButtons.forEach(function(button) {
    button.addEventListener("click", function() {
      // Retire la classe 'active' de tous les boutons
      armButtons.forEach(function(innerButton) {
        innerButton.classList.remove("active");
      });

      // Ajoute la classe 'active' au bouton cliqué
      button.classList.add("active");
    });
  });

  // Sélectionne la div ayant l'id 'left'
  const leftDiv = document.getElementById("left");

  // Sélectionne la div ayant l'id 'right'
  const rightDiv = document.getElementById("right");

  // Ajoute un écouteur d'événements pour les clics sur la div 'right'
  rightDiv.addEventListener("click", function() {
    leftDiv.style.backgroundColor = "#EAEDED";
    leftDiv.style.zIndex = "1";
    rightDiv.style.backgroundColor = "#F4F6F7";
    rightDiv.style.zIndex = "2";
  });

  // Ajoute un écouteur d'événements pour les clics sur la div 'left'
  leftDiv.addEventListener("click", function() {
    leftDiv.style.backgroundColor = "#F4F6F7";
    leftDiv.style.zIndex = "2";
    rightDiv.style.backgroundColor = "#EAEDED";
    rightDiv.style.zIndex = "1";
  });
});

//mouvements prédéfinis

// Sélectionnez tous les boutons prédéfinis
const presetButtons = document.querySelectorAll('.presetBtn');

// Ajoutez un écouteur d'événements à chaque bouton
presetButtons.forEach(button => {
  button.addEventListener('click', function() {
    // Retirez la classe 'active' de tous les boutons
    presetButtons.forEach(btn => btn.classList.remove('active'));
    // Ajoutez la classe 'active' au bouton cliqué
    this.classList.add('active');
    let movement = this.id;
    // envoyer le mouvement
    if(socket.readyState){
      socket.send(JSON.stringify({ command: movement }));
    }
  });
});

// Joystick pour Leenby - Nathan TASTET - 2023

// Initialiser les variables
document.addEventListener("DOMContentLoaded", function() {
  
  const container = document.getElementById('joystickControls2');
  const base = document.getElementById('joystickBase');
  const handle = document.getElementById('joystickHandle');
  let joystickIsDragging = false;

  // Ajouter des événements de souris
  container.addEventListener('mousedown', startGrab);
  container.addEventListener('touchstart', startGrab);
  
  
  function startGrab(e) {
    e.preventDefault();
    container.style.cursor = "grabbing";
    joystickIsDragging = true;
  }

  document.addEventListener('mousemove', moveJoystick);
  document.addEventListener('touchmove', moveJoystick);

  
  function moveJoystick(e) {
    e.preventDefault();
    if (!joystickIsDragging) return;
    
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
    afficherCoordonnees(x,y,maxDistance);
  };

  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchend', endDrag);
  
  
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
      x = x-maxDistance;
      y = y-maxDistance;
      afficherCoordonnees(x,y,maxDistance);
    };

    returnToCenter();
  }
});

function afficherCoordonnees(x, y, maxDistance) {
    // Normalisation des distances x et y : conversion en un ratio compris entre 0 et 1
    const normalizedX = x / maxDistance;
    const normalizedY = - y / maxDistance; // l'axe y est a l'envers
    // Calculer l'angle en radians
    const angleRad = Math.atan2(normalizedY, normalizedX);
    // Convertir en degrés
    const angleDeg = (angleRad * 180 / Math.PI + 360) % 360;

    if(Math.abs(normalizedX) < anglemort && Math.abs(normalizedY) < anglemort) {
      // on est dans l'angle mort, tout est nul.
      leftMotor = 0;
      rightMotor = 0;
    }
    else{
      // Calcul de la puissance de chaque moteur
      leftMotor = normalizedY + normalizedX;
      rightMotor = normalizedY - normalizedX;
      leftMotor = Math.max(-1, Math.min(1, leftMotor)) * 100;
      rightMotor = Math.max(-1, Math.min(1, rightMotor)) * 100;
      leftMotor = parseFloat(leftMotor).toFixed(1);
      rightMotor = parseFloat(rightMotor).toFixed(1);
    }
    // Affichage
    document.getElementById('coordinates').textContent = `X: ${Math.round(normalizedX*100)}, Y: ${Math.round(normalizedY*100)}, Angle: ${Math.round(angleDeg)}°, 
    Moteur gauche :  ${leftMotor}, Moteur droit : ${rightMotor} `;
}