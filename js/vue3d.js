// vue3d.js
// Programme qui gère la vue 3D sur la droite de l'écran
// Par Nathan TASTET - 2023
// on utilise la librairie three.js qui est importée depuis le html.

// IMPORT 

import * as THREE from '../lib/three.module.js';
import { FBXLoader } from '../lib/FBXLoader.js'; // OBJETS

// CONSTANTES

const distance_cam = 100;

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

    // Charger le modèle 3D
    const fbxLoader = new FBXLoader();
    let mixer; // Déclarer le mixer en dehors de la fonction de chargement
    let bones = []; // tableau des os du modèle 3d

    fbxLoader.load(
        './model3d/robot.fbx', // chemin vers le fichier .fbx
        function (fbx) { // appelé lorsque la ressource est chargée
            fbx.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                }
                // détection des os
                if (child.isBone) {
                bones.push(child); // Ajouter l'os au tableau
                console.log(child.name); // Imprimer le nom de l'os sur la console
                }
            });

            // Créer et ajouter le squelette
            const skeleton = new THREE.SkeletonHelper(fbx);
            scene.add(skeleton);

            // Configurer le mixer et les animations
            mixer = new THREE.AnimationMixer(fbx);
            if (fbx.animations && fbx.animations.length > 0) {
                const action = mixer.clipAction(fbx.animations[0]);
                action.play();
            }

            scene.add(fbx);

        },
        function (xhr) { // appelé lorsque le téléchargement progresse
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) { // appelé lorsque le chargement échoue
            console.error('An error happened', error);
        }
    );

    // Ajouter le reste de la logique de mise à jour du mixer dans la boucle de rendu
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);

        // Exemple de manipulation de chaque os
        bones.forEach(bone => {
            const delta = clock.getDelta();
            bone.rotation.y += delta; // Modifier cette ligne pour manipuler la rotation
        });

        renderer.render(scene, camera);
    }


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
    
        // Calculer les coordonnées sphériques pour la rotation autour de l'axe Y
        camera3d.position.x = distance_cam * Math.sin(theta);
        camera3d.position.z = distance_cam * Math.cos(theta);
    
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