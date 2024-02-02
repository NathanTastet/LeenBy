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
    "leftBone": "mixamorigLeftArm",
    "rightBone": "mixamorigRightArm",
    "rotation_type": "y"
  },
  {
    "id": 2,
    "name": "Pliage Bras",
    "minAngle": -159.6,
    "maxAngle": 159.6,
    "leftBone": "mixamorigLeftArm",
    "rightBone": "mixamorigRightArm",
    "rotation_type": "x"
  },
  {
    "id": 3,
    "name": "Rotation Avant-Bras",
    "minAngle": -159.6,
    "maxAngle": 159.6,
    "leftBone": "mixamorigLeftForeArm",
    "rightBone": "mixamorigRightForeArm",
    "rotation_type": "y"
  },
  {
    "id": 4,
    "name": "Pliage Coude",
    "minAngle": -159.6,
    "maxAngle": 159.6,
    "leftBone": "mixamorigLeftForeArm",
    "rightBone": "mixamorigRightForeArm",
    "rotation_type": "x"
  },
  {
    "id": 5,
    "name": "Rotation Main",
    "minAngle": -159.8,
    "maxAngle": 159.8,
    "leftBone": "mixamorigLeftHand",
    "rightBone": "mixamorigRightHand",
    "rotation_type": "y"
  },
  {
    "id": 6,
    "name": "Pliage Main",
    "minAngle": -159.8,
    "maxAngle": 159.8,
    "leftBone": "mixamorigLeftHand",
    "rightBone": "mixamorigRightHand",
    "rotation_type": "x"
  },
  {
    "id": 7,
    "name": "Pliage Pouce",
    "minAngle": -159.8,
    "maxAngle": 159.8,
    "leftBone": "mixamorigLeftHandIndex3",
    "rightBone": "mixamorigRightHandIndex3",
    "rotation_type": "x"
  }
];

