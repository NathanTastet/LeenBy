

document.addEventListener("DOMContentLoaded", function() {
  const requete = new XMLHttpRequest();
  requete.open("POST", "http://192.168.4.1:8080", true);
  requete.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

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

  // bouton de validation
  let check_button = document.getElementById("check_button");
  check_button.addEventListener("click", function() {
      check_button.classList.toggle("active");
      requete.send(JSON.stringify({ test1: "test", test2: 0xFF}));
  });



  // Gestion du slider : 
  let slider1 = document.getElementById("angle-slider1");
  let slider2 = document.getElementById("angle-slider2");
  let slider3 = document.getElementById("angle-slider3");
  let slider4 = document.getElementById("angle-slider4");
  let angle1 = document.getElementById("angle-number1");
  let angle2 = document.getElementById("angle-number2");
  let angle3 = document.getElementById("angle-number3");
  let angle4 = document.getElementById("angle-number4");
  let isDragging = false;
  let isDragging2 = false;
  let isDragging3 = false;
  let isDragging4 = false;

  // détection des différents appuis de slider1
  slider1.addEventListener("mousedown", function(e) {
    isDragging = true;
  });

  slider1.addEventListener("mousemove", function(e) {
    if (isDragging) {
      let rect = slider1.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let width = rect.right - rect.left;
      let value = (x / width) * 360 - 180;  // Convertit la position x en une valeur entre -180 et 180
      slider1.value = value;
      angle1.value= slider1.value;
      document.getElementById('angle1').textContent = `${Math.round(slider1.value)}°`;
      // y'a plus qu'a envoyer ici à la rasp
    }
  });

  slider1.addEventListener("mouseup", function(e) {
    isDragging = false;
  });

  slider1.addEventListener("mouseleave", function(e) {
    isDragging = false;
  });

  // Gestion du selecteur numérique d'angle
  angle1.addEventListener("input",function(e){
      if(-180 <= angle1.value & angle1.value<= 180){
        slider1.value = angle1.value;
      }
      if(-180 > angle1.value){
        slider1.value = -180;
      }
      if(angle1.value > 180){
        slider1.value = 180;
      }
      document.getElementById('angle1').textContent = `${Math.round(slider1.value)}°`;
  });



  // détection des différents appuis de slider2
  slider2.addEventListener("mousedown", function(e) {
    isDragging2 = true;
  });


  slider2.addEventListener("mousemove", function(e) {
    if (isDragging2) {
      let rect = slider2.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let width = rect.right - rect.left;
      let value = (x / width) * 360 - 180;  // Convertit la position x en une valeur entre -180 et 180
      slider2.value = value;
      angle2.value= slider2.value;
      document.getElementById('angle2').textContent = `${Math.round(slider2.value)}°`;
      // y'a plus qu'a envoyer ici à la rasp
    }
  });

  slider2.addEventListener("mouseup", function(e) {
    isDragging2 = false;
  });

  slider2.addEventListener("mouseleave", function(e) {
    isDragging2 = false;
  });

  angle2.addEventListener("input",function(e){
    if(-180 <= angle2.value & angle2.value<= 180){
      slider2.value = angle2.value;
    }
    if(-180 > angle2.value){
      slider2.value = -180;
    }
    if(angle2.value > 180){
      slider2.value = 180;
    }
    document.getElementById('angle2').textContent = `${Math.round(slider2.value)}°`;
  });



  // détection des différents appuis de slider3
  slider3.addEventListener("mousedown", function(e) {
    isDragging3 = true;
  });

  slider3.addEventListener("mousemove", function(e) {
    if (isDragging3) {
      let rect = slider3.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let width = rect.right - rect.left;
      let value = (x / width) * 360 - 180;  // Convertit la position x en une valeur entre -180 et 180
      slider3.value = value;
      angle3.value= slider3.value;
      document.getElementById('angle3').textContent = `${Math.round(slider3.value)}°`;
      // y'a plus qu'a envoyer ici à la rasp
    }
  });

  slider3.addEventListener("mouseup", function(e) {
    isDragging3 = false;
  });

  slider3.addEventListener("mouseleave", function(e) {
    isDragging3 = false;
  });

  angle3.addEventListener("input",function(e){
    if(-180 <= angle3.value & angle3.value<= 180){
      slider3.value = angle3.value;
    }
    if(-180 > angle3.value){
      slider3.value = -180;
    }
    if(angle3.value > 180){
      slider3.value = 180;
    }
    document.getElementById('angle3').textContent = `${Math.round(slider3.value)}°`;
  });

  // détection des différents appuis de slider4
  slider4.addEventListener("mousedown", function(e) {
    isDragging4 = true;
  });

  slider4.addEventListener("mousemove", function(e) {
    if (isDragging4) {
      let rect = slider4.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let width = rect.right - rect.left;
      let value = (x / width) * 360 - 180;  // Convertit la position x en une valeur entre -180 et 180
      slider4.value = value;
      angle4.value= slider4.value;
      document.getElementById('angle4').textContent = `${Math.round(slider4.value)}°`;
      // y'a plus qu'a envoyer ici à la rasp
    }
  });

  slider4.addEventListener("mouseup", function(e) {
    isDragging4 = false;
  });

  slider4.addEventListener("mouseleave", function(e) {
    isDragging4 = false;
  });

  angle4.addEventListener("input",function(e){
    if(-180 <= angle4.value & angle4.value<= 180){
      slider4.value = angle4.value;
    }
    if(-180 > angle4.value){
      slider4.value = -180;
    }
    if(angle4.value > 180){
      slider4.value = 180;
    }
    document.getElementById('angle4').textContent = `${Math.round(slider4.value)}°`;
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
