document.addEventListener("DOMContentLoaded", function() {
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
  });



// Gestion du slider : 
let slider1 = document.getElementById("angle-slider1");
let slider2 = document.getElementById("angle-slider2");
let slider3 = document.getElementById("angle-slider3");
let slider4 = document.getElementById("angle-slider4");
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