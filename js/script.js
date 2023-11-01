

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

  
// initation des angles pour le bouton de validation et de RAZ

let slider1 = document.getElementById("angle-slider1");
let slider2 = document.getElementById("angle-slider2");
let slider3 = document.getElementById("angle-slider3");
let slider4 = document.getElementById("angle-slider4");

let angle1 = document.getElementById("angle-number1");
let angle2 = document.getElementById("angle-number2");
let angle3 = document.getElementById("angle-number3");
let angle4 = document.getElementById("angle-number4");

let txt1 = document.getElementById("angle-text1");
let txt2 = document.getElementById("angle-text2");
let txt3 = document.getElementById("angle-text3");
let txt4 = document.getElementById("angle-text4");


// mise a jour du remplissage du slider
function updateSliderStyle(sliderElement) {
      // Convertis la valeur de -180-180 en pourcentage 0-100
  let percentage = (((sliderElement.value) / 360.0) * 100.0) + 50; 
  sliderElement.style.setProperty('--value', percentage + '%');
}

//fonction de remise à zéro
function remiseazero() {
  slider1.value = 0;
  slider2.value = 0;
  slider3.value = 0;
  slider4.value = 0;
  angle1.value = 0;
  angle2.value = 0;
  angle3.value = 0;
  angle4.value = 0;
  txt1.textContent = '0.0°';
  txt2.textContent = '0.0°';
  txt3.textContent = '0.0°';
  txt4.textContent = '0.0°';
  updateSliderStyle(slider1);
  updateSliderStyle(slider2);
  updateSliderStyle(slider3);
  updateSliderStyle(slider4);
}

document.addEventListener("DOMContentLoaded", function() {
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



  function setupSliderAndAngle(sliderId, angleId, angleText) {
    let slider = document.getElementById(sliderId);
    let angle = document.getElementById(angleId);
    let texte = document.getElementById(angleText);
    let isDragging = false;
  
    function startDragSlider(e) {
      isDragging = true;
      let clientX = e.touches ? e.touches[0].clientX : e.clientX; // choix de gauche si event tactile ou choix de droite si event souris
      texte.textContent = `${parseFloat(updateSliderAndAngle(slider, angle, clientX)).toFixed(1)}°`;
    }
    
    slider.addEventListener("mousedown", startDragSlider);
    slider.addEventListener("touchstart", startDragSlider);
    
    function moveDragSlider(e) {
      if (isDragging) {
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        texte.textContent = `${parseFloat(updateSliderAndAngle(slider, angle, clientX)).toFixed(1)}°`;
      }
    }

    
    slider.addEventListener("mousemove", moveDragSlider);
    slider.addEventListener("touchmove", moveDragSlider);
  

    function stopDragSlider(){
      isDragging = false;
    }

    
    slider.addEventListener("mouseup", stopDragSlider);
    slider.addEventListener("mouseleave", stopDragSlider);
    slider.addEventListener("touchend", stopDragSlider);

    
  
    angle.addEventListener("input", function() {
      if(-180 <= angle.value & angle.value<= 180){
        slider.value = angle.value;
      }
      if(-180 > angle.value){
        slider.value = -180;
      }
      if(angle.value > 180){
        slider.value = 180;
      }
      texte.textContent = `${parseFloat(slider.value).toFixed(1)}°`;
      updateSliderStyle(slider);
    });
  }
  
  function updateSliderAndAngle(slider, angle, clientX) {
    const rect = slider.getBoundingClientRect();
    const x = clientX !== null ? clientX - rect.left : null;
    const width = rect.right - rect.left;
    const value = x !== null ? (x / width) * 360 - 180 : parseFloat(angle.value);
  
    if (value < -180) {
      slider.value = -180;
      angle.value = -180;
    } else if (value > 180) {
      slider.value = 180;
      angle.value = 180;
    } else {
      slider.value = value.toFixed(1);
      angle.value = value.toFixed(1);
    }
    updateSliderStyle(slider);
    return slider.value;
  }


  // Configuration des sliders et angles

  setupSliderAndAngle("angle-slider1", "angle-number1", "angle-text1");
  setupSliderAndAngle("angle-slider2", "angle-number2", "angle-text2");
  setupSliderAndAngle("angle-slider3", "angle-number3", "angle-text3");
  setupSliderAndAngle("angle-slider4", "angle-number4", "angle-text4");

  // bouton de validation
  let check_button = document.getElementById("check_button");
  check_button.addEventListener("click", function() {
    if(socket.readyState){
        socket.send(JSON.stringify({ angle1: angle1.value, angle2: angle2.value, angle3: angle3.value,angle4: angle4.value}));
    }
  });

  // bouton de raz
  let reset_button = document.getElementById("reset_button");
  reset_button.addEventListener("click", remiseazero);
  
  


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