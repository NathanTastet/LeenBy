// vue3d.js
// Programme qui gère la vue 3D sur la droite de l'écran
// Par Nathan TASTET - 2023
// on utilise la librairie three.js qui est importée depuis le html.

// IMPORT 

import * as THREE from '../lib/three.module.js'; // VUE 3D
import { FBXLoader } from '../lib/FBXLoader.js'; // OBJETS
import { motorInfo } from './motorInfo.js';
import { modeBras } from './buttonControl.js';
import { sliderValuesLeft, sliderValuesRight } from './sliderControl.js';

// --- VARIABLES GLOBALES ---

let container3d, camera3d, renderer3d, distance_Cam;
let bones = []; // tableau des os du modèle 3d
let boneInitialRotations = {}; // tableau des angles initaux
let pointLight; // lumière

// --- FONCTION ---

// fonction permettant d'initialiser la vue 3d
export function setup3D(){

    // Sélectionner le conteneur pour la scène 3D
    container3d = document.getElementById('right2');

    // Initialiser la scène
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF4F6F7);


    // Créer une caméra perspective
    camera3d = new THREE.PerspectiveCamera(75, container3d.clientWidth / container3d.clientHeight, 0.1, 1000);

    // Créer le rendu WebGL
    renderer3d = new THREE.WebGLRenderer();
    renderer3d.setSize(container3d.clientWidth, container3d.clientHeight);
    renderer3d.shadowMap.enabled = true; // Active les ombres
    container3d.appendChild(renderer3d.domElement);

    // Créer une lumière ponctuelle
    pointLight = new THREE.PointLight(0xFFFFFF, 3000, distance_Cam);

    pointLight.castShadow = true; // Active les ombres pour cette lumière
    scene.add(pointLight);
    
    // Charger le modèle 3D
    const fbxLoader = new FBXLoader();

    fbxLoader.load(
        './model3d/robot.fbx', // chemin vers le fichier .fbx
        function (fbx) { // appelé lorsque la ressource est chargée
            fbx.traverse(function (child) {
                if (child instanceof THREE.Mesh) {

                    child.material = new THREE.MeshStandardMaterial({ color: 0xB2B2B2});
                    child.castShadow = true; // Permet à l'objet de projeter des ombres
                    child.receiveShadow = true; // Permet à l'objet de recevoir des ombres

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

            scene.add(fbx);
            
            // Calculer la boîte englobante du modèle complet
            var box = new THREE.Box3().setFromObject(fbx);

            // La taille est la différence entre les valeurs minimales et maximales
            var size = box.getSize(new THREE.Vector3());

            distance_Cam = size.y;

            // Ajouter un quadrillage
            // Divisions dans le quadrillage
            var divisions = 10;

            // Création du quadrillage XZ (le quadrillage par défaut s'étend déjà le long de XZ)
            var gridHelperXZ = new THREE.GridHelper(size.y, divisions, 0x00ff00, 0x444444);
            // Pas besoin de rotation pour XZ
            gridHelperXZ.position.y = -size.y / 2; // Déplacez le sur l'axe Y pour qu'il soit visible

            scene.add(gridHelperXZ);

            // Positionner la caméra en fonction de la taille du modèle
            camera3d.position.z = distance_Cam; 

            // Positionne la lumière au même endroit que la caméra
            pointLight.position.set(camera3d.position.x, camera3d.position.y, camera3d.position.z);
            
            // Assurez-vous que la caméra regarde le centre de votre modèle
            camera3d.lookAt(fbx.position);

            // Appeler la fonction de rendu
            animate();
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
        if (currentPosition.x < 5 || currentPosition.x > container3d.clientWidth || 
        currentPosition.y < 5 || currentPosition.y > container3d.clientHeight) {
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
        camera3d.position.x = distance_Cam * Math.sin(theta);
        camera3d.position.z = distance_Cam * Math.cos(theta);
            
        // Faire pointer la caméra vers le cube
        camera3d.lookAt(scene.position);

        // Mettre à jour la position de la lumière
        pointLight.position.set(camera3d.position.x, camera3d.position.y, camera3d.position.z);
    
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


// fonction pour mettre à jour le modèle 3d en fonction du tableau de valeurs
export function update3d() {
    motorInfo.forEach(motor => {
        let angleLeft = THREE.MathUtils.degToRad(sliderValuesLeft[motor.id]);
        let angleRight = THREE.MathUtils.degToRad(sliderValuesRight[motor.id]);

        const os_abouger = [];

        switch (modeBras) {
            case 'brasGauche':
                os_abouger.push({ boneName: motor.leftBone, angle: angleLeft });
                break;
            case 'brasDroit':
                os_abouger.push({ boneName: motor.rightBone, angle: angleRight });
                break;
            case 'deuxBras':
                os_abouger.push({ boneName: motor.leftBone, angle: angleLeft });
                os_abouger.push({ boneName: motor.rightBone, angle: angleRight });
                break;
        }

        os_abouger.forEach(({ boneName, angle }) => {
            const bone = bones.find(b => b.name === boneName);
            if (bone) {
                const initialRotation = boneInitialRotations[boneName];
                if (initialRotation) {
                    let appliedAngle = angle;
                    if (boneName.includes("Right") & motor.rotation_type == 'y') {
                        appliedAngle *= -1;
                    }
                    bone.rotation[motor.rotation_type] = initialRotation[motor.rotation_type] + appliedAngle;
                }
            }
        });
    });
}

// fonction pour détecter les collisions sur le modèle 3d

export function detectionCollisions(){
    if (collision_Detector.detectCollisions()){
        console.log("collision");
    }
}

