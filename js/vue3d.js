// vue3d.js
// Programme qui gère la vue 3D sur la droite de l'écran
// Par Nathan TASTET - 2023
// on utilise la librairie three.js qui est importée depuis le html.

// CONSTANTES

const distance_cam = 5;

// --- VARIABLES GLOBALES ---
let container3d, camera3d, renderer3d;
// --- FONCTION ---

// fonction permettant d'initialiser la vue 3d
export function setup3D(){
    // Sélectionner le conteneur pour la scène 3D
    container3d = document.getElementById('right2');

    // Initialiser la scène
    const scene = new THREE.Scene();

    // Créer une caméra perspective
    camera3d = new THREE.PerspectiveCamera(75, container3d.clientWidth / container3d.clientHeight, 0.1, 1000);
    camera3d.position.z = distance_cam;
    
    // Créer le rendu WebGL
    renderer3d = new THREE.WebGLRenderer();
    renderer3d.setSize(container3d.clientWidth, container3d.clientHeight);
    container3d.appendChild(renderer3d.domElement);

    // Créer un cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xb900ff });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Créer les arêtes pour le cube
    const edgeGeometry = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // Choisissez la couleur souhaitée
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    cube.add(edges); 

    // Ajouter l'écouteur d'événement pour les changements de taille
    window.addEventListener('resize', resize3d);

    // Fonction de rendu récursive qui va s'appeller elle meme a chaque frame
    function animate() {
        requestAnimationFrame(animate);
        renderer3d.render(scene, camera3d);
    }

    // Appeler la fonction de rendu
    animate();

    let isDragging3d = false;
    let previousMousePosition = { x: 0, y: 0 };
    let theta = 0; // Angle autour de l'axe Y
    let phi = 0; // Angle autour de l'axe X
    
    function startGrab(e) {
        isDragging3d = true;
        previousMousePosition = {
            x: e.offsetX || e.touches?.[0].pageX,
            y: e.offsetY || e.touches?.[0].pageY
        };
    }
    
    function endDrag(e) {
        isDragging3d = false;
    }
    
    function move3d(e) {
        if (!isDragging3d) {
            return;
        }
    
        e.preventDefault();
    
        let currentPosition = {
            x: e.offsetX || e.touches?.[0].pageX,
            y: e.offsetY || e.touches?.[0].pageY
        };

        // Vérifier si la souris est toujours dans le conteneur
        if (currentPosition.x < 0 || currentPosition.x > container3d.clientWidth || 
        currentPosition.y < 0 || currentPosition.y > container3d.clientHeight) {
        endDrag();
        return;
        }
    
        let deltaMove = {
            x: currentPosition.x - previousMousePosition.x,
            y: currentPosition.y - previousMousePosition.y
        };
    
        let rotationSpeed = 0.005;
        theta -= deltaMove.x * rotationSpeed;
        phi -= deltaMove.y * rotationSpeed;
    
        // Restreindre phi pour éviter des rotations étranges
        phi = Math.min(Math.max(-Math.PI / 2, phi), Math.PI / 2);
    
        // Calculer les coordonnées sphériques
        camera3d.position.x = distance_cam * Math.sin(theta) * Math.cos(phi);
        camera3d.position.y = distance_cam * Math.sin(phi);
        camera3d.position.z = distance_cam * Math.cos(theta) * Math.cos(phi);
    
        // Faire pointer la caméra vers le cube
        camera3d.lookAt(scene.position);
    
        previousMousePosition = currentPosition;
    }
    
    container3d.addEventListener('mousedown', startGrab);
    container3d.addEventListener('touchstart', startGrab);
    document.addEventListener('mousemove', move3d);
    document.addEventListener('touchmove', move3d);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
    container3d.addEventListener('mouseleave', endDrag);
}

// fonction permettant de mettre à jour l'affichage de la vue 3d notamment quand on change la taille de 
// l'affichage ou du passage a vue normale a vue 3d

export function resize3d() {
    const width = container3d.clientWidth;
    const height = container3d.clientHeight;

    // Mettre à jour la caméra
    camera3d.aspect = width / height;
    camera3d.updateProjectionMatrix();

    // Mettre à jour le rendu
    renderer3d.setSize(width, height);
}