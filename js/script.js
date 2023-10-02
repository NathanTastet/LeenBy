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
let slider = document.getElementById("angle-slider");
let isDragging = false;

// détection des différents appuis
slider.addEventListener("mousedown", function(e) {
  isDragging = true;
});

slider.addEventListener("mousemove", function(e) {
  if (isDragging) {
    let rect = slider.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let width = rect.right - rect.left;
    let value = (x / width) * 360 - 180;  // Convertit la position x en une valeur entre -180 et 180
    slider.value = value;
    document.getElementById('angle1').textContent = `${Math.round(slider.value)}°`;
    // y'a plus qu'a envoyer ici à la rasp
  }
});

slider.addEventListener("mouseup", function(e) {
  isDragging = false;
});

slider.addEventListener("mouseleave", function(e) {
  isDragging = false;
});