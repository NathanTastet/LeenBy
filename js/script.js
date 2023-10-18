

document.addEventListener("DOMContentLoaded", function() {

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
  
    slider.addEventListener("mousedown", function(e) {
      isDragging = true;
      texte.textContent = `${parseFloat(updateSliderAndAngle(slider, angle, e.clientX)).toFixed(1)}°`;
    });
  
    slider.addEventListener("mousemove", function(e) {
      if (isDragging) {
        texte.textContent = `${parseFloat(updateSliderAndAngle(slider, angle, e.clientX)).toFixed(1)}°`;
      }
    });
  
    slider.addEventListener("mouseup", function() {
      isDragging = false;
    });
  
    slider.addEventListener("mouseleave", function() {
      isDragging = false;
    });
  
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
    let angle1 = document.getElementById(angle1);
    let angle2 = document.getElementById(angle2);
    let angle3 = document.getElementById(angle3);
    let angle4 = document.getElementById(angle4);
    //envoi d'un socket
    let socket = new WebSocket("ws://192.168.4.1:8080");
    socket.onopen = function(e) {
        check_button.classList.toggle("active");
        socket.send(JSON.stringify({ angle1: angle1.value, angle2: angle2.value, angle3: angle3.value,angle4: angle4.value}));
    };
    socket.close();
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
