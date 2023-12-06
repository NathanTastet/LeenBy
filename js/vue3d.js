// vue3d.js
// Programme qui gère la vue 3D sur la droite de l'écran
// Par Nathan TASTET - 2023
// on utilise la librairie three.js qui est importée depuis le html.

// IMPORT 

import * as THREE from '../lib/three.module.js';
import { FBXLoader } from '../lib/FBXLoader.js'; // OBJETS
import { motorInfo } from './motorInfo.js';

// CONSTANTES

const distance_cam = 100;

// --- VARIABLES GLOBALES ---
let container3d, camera3d, renderer3d;
let bones = []; // tableau des os du modèle 3d
let boneInitialRotations = {}; // tableau des angles initaux
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
                boneInitialRotations[child.name] = {
                    x: child.rotation.x,
                    y: child.rotation.y,
                    z: child.rotation.z
                };
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

    // fonction récursive qui va s'appeller elle meme a chaque frame
    function animate() {
        requestAnimationFrame(animate);
        renderer3d.render(scene, camera3d);
    }


    // Ajouter l'écouteur d'événement pour les changements de taille
    window.addEventListener('resize', resize3d);

    

    // Appeler la fonction de rendu
    animate();

    let isDragging3d = false;
    let previousMousePosition = { x: 0, y: 0 };
    let theta = 0; // Angle autour de l'axe Y
    
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


// fonction pour mettre à jour le modèle 3d quand on bouge un slider

export function update3d(slider){
    // déterminer à quel moteur le slider correspond sur MoteurInfo
    const motorId = parseInt(slider.id.replace('angle-slider', '')); // on enleve angle-slider au nom du slider ce qui laisse que l'id.
    // trouver le moteur correspondant dans motorInfo
    const motor = motorInfo.find(m => m.id === motorId);
    if (!motor) return; // Sortir si le moteur n'est pas trouvé
    // Récupérer l'angle du slider
    const angle = THREE.MathUtils.degToRad(slider.value); // Convertir les degrés en radians

    // Déterminer quel os bouger
    // faut qu'il regarde l'état du sélecteur de bras
    const armButtons = document.querySelectorAll(".armButton");
    const os_abouger = [];

    armButtons.forEach(button => {
        if(button.classList.contains("active")){
            // faut que je prenne l'id du bouton, ensuite on regarde quel bras c'était
            switch(button.id){
                case 'brasGauche' : 
                os_abouger.push(motor.leftBone);
                break;
                case 'brasDroit' : 
                os_abouger.push(motor.rightBone);
                break;
                case 'deuxBras':
                os_abouger.push(motor.leftBone);
                os_abouger.push(motor.rightBone);
                break;
            }
        }
    });

    os_abouger.forEach(boneName => {
        const bone = bones.find(b => b.name === boneName);
        if (bone) {
            // Récupérer la rotation initiale
            const initialRotation = boneInitialRotations[boneName];

            if (initialRotation) {

                let appliedAngle = angle;
                // Inverser l'angle pour les os du côté droit dans le cas d'une rotation sur l'axe y
                if (boneName.includes("Right") & motor.rotation_type == 'y') {
                    appliedAngle *= -1;
                }


                // Appliquer la nouvelle rotation basée sur la référence initiale
                bone.rotation[motor.rotation_type] = initialRotation[motor.rotation_type] + appliedAngle;
            }
        }
    });

}

// amélioration possible: blocage corps humain
