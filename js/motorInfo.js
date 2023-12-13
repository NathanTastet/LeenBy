// motorInfo.js
// Variables liées au contrôle des moteurs
// Par Nathan TASTET - 2023


// Information sur les moteurs sur un bras du robot
export const motorInfo = [
  {
    "id": 1,
    "name": "Rotation Bras",
    "minAngle": -159.6,
    "maxAngle": 159.6,
    "leftBone": "bras-gauche",
    "rightBone": "bras-droit",
    "rotation_type": "y"
  },
  {
    "id": 2,
    "name": "Pliage Bras",
    "minAngle": -159.6,
    "maxAngle": 159.6,
    "leftBone": "bras-gauche",
    "rightBone": "bras-droit",
    "rotation_type": "x"
  },
  {
    "id": 3,
    "name": "Rotation Avant-Bras",
    "minAngle": -159.6,
    "maxAngle": 159.6,
    "leftBone": "avant-bras-gauche",
    "rightBone": "avant-bras-droit",
    "rotation_type": "y"
  },
  {
    "id": 4,
    "name": "Pliage Coude",
    "minAngle": -159.6,
    "maxAngle": 159.6,
    "leftBone": "avant-bras-gauche",
    "rightBone": "avant-bras-droit",
    "rotation_type": "x"
  },
  {
    "id": 5,
    "name": "Rotation Main",
    "minAngle": -159.8,
    "maxAngle": 159.8,
    "leftBone": "doigt1-gauche",
    "rightBone": "doigt1-droit",
    "rotation_type": "y"
  },
  {
    "id": 6,
    "name": "Pliage Main",
    "minAngle": -159.8,
    "maxAngle": 159.8,
    "leftBone": "doigt1-gauche",
    "rightBone": "doigt1-droit",
    "rotation_type": "x"
  },
  {
    "id": 7,
    "name": "Pliage Pouce",
    "minAngle": -159.8,
    "maxAngle": 159.8,
    "leftBone": "doigt2-gauche",
    "rightBone": "doigt2-droit",
    "rotation_type": "x"
  }
];