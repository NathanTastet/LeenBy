// Joystick pour Leenby - Nathan TASTET - 2023

// Initialiser les variables
document.addEventListener("DOMContentLoaded", function() {
  
  const container = document.getElementById('joystickControls2');
  const base = document.getElementById('joystickBase');
  const handle = document.getElementById('joystickHandle');
  let joystickIsDragging = false;

  // Ajouter des événements de souris
  container.addEventListener('mousedown', function(e) {
    e.preventDefault();
    container.style.cursor = "grabbing";
    joystickIsDragging = true;
  });

  document.addEventListener('mousemove', function(e) {
    e.preventDefault();
    if (!joystickIsDragging) return;
    
    const rect = base.getBoundingClientRect();
    let x = e.clientX - rect.left - rect.width / 2;
    let y = e.clientY - rect.top - rect.height / 2;
    
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
  });

  document.addEventListener('mouseup', function() {
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
  });
});

function afficherCoordonnees(x, y, maxDistance) {
    // Normalisation des distances x et y : conversion en un ratio compris entre 0 et 1
    const normalizedX = x / maxDistance;
    const normalizedY = - y / maxDistance; // l'axe y est a l'envers
    // Calculer l'angle en radians
    const angleRad = Math.atan2(normalizedY, normalizedX);
    // Convertir en degrés
    const angleDeg = (angleRad * 180 / Math.PI + 360) % 360;
    // Calcul de la puissance de chaque moteur
    let leftMotor = normalizedY + normalizedX;
    let rightMotor = normalizedY - normalizedX;
    leftMotor = Math.max(-1, Math.min(1, leftMotor)) * 100;
    rightMotor = Math.max(-1, Math.min(1, rightMotor)) * 100;
    // Affichage
    document.getElementById('coordinates').textContent = `X: ${Math.round(normalizedX*100)}, Y: ${Math.round(normalizedY*100)}, Angle: ${Math.round(angleDeg)}°, 
    Moteur gauche :  ${Math.round(leftMotor)}, Moteur droit : ${Math.round(rightMotor)} `;
}
