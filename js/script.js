// 1. Initialiser les variables
const container = document.getElementById('joystickContainer');
const base = document.getElementById('joystickBase');
const handle = document.getElementById('joystickHandle');
let isDragging = false;

// 2. Ajouter des événements de souris
container.addEventListener('mousedown', function(e) {
  isDragging = true;
});

document.addEventListener('mousemove', function(e) {
  if (!isDragging) return;
  
  const rect = base.getBoundingClientRect();
  let x = e.clientX - rect.left - rect.width / 2;
  let y = e.clientY - rect.top - rect.height / 2;
  
  // 3. Calculer les nouvelles positions
  const distance = Math.sqrt(x * x + y * y);
  const maxDistance = rect.width / 2;
  
  // 4. Restreindre les déplacements
  if (distance > maxDistance) {
    x *= maxDistance / distance;
    y *= maxDistance / distance;
  }
  
  handle.style.left = `${x + maxDistance}px`;
  handle.style.top = `${y + maxDistance}px`;
  // 5. Afficher les coordonnées
  afficherCoordonnees(x,y,maxDistance);
});

document.addEventListener('mouseup', function() {
  isDragging = false;

  // 6. Retour à la base si on lâche
  const returnToCenter = () => {
    if (isDragging) return;

    var x = parseFloat(handle.style.left);
    var y = parseFloat(handle.style.top);
    const maxDistance = base.getBoundingClientRect().width / 2;
    
    if (x === maxDistance && y === maxDistance) return;

    handle.style.left = `${x + (maxDistance - x) * 0.1}px`;
    handle.style.top = `${y + (maxDistance - y) * 0.1}px`;

    requestAnimationFrame(returnToCenter);
    x = x-150;
    y = y-150;
    afficherCoordonnees(x,y,maxDistance);
  };

  returnToCenter();
});

function afficherCoordonnees(x, y, maxDistance) {
    // Calculer l'angle en radians
    const angleRad = Math.atan2(y, x);
    // Convertir en degrés
    const angleDeg = (angleRad * 180 / Math.PI + 360) % 360;
    // Calculer la vitesse du déplacement
    const power = Math.sqrt(x * x + y * y) / maxDistance;
    // Afficher les coordonnées, l'angle et la vitesse
    document.getElementById('coordinates').textContent = `X: ${Math.round(x)}, Y: ${Math.round(y)}, Angle: ${Math.round(angleDeg)}°, Vitesse: ${Math.round(power * 100)}%`;
}
