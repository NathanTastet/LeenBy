// motorInfo.js
// Variables liées au contrôle des moteurs
// Par Nathan TASTET - 2023


// Information sur les moteurs sur un bras du robot
export const motorInfo = [
  { id: 1, name: 'Rotation Épaule', minAngle: -159.6, maxAngle: 159.6, bone: 0, rotation_type: 0 },
  { id: 2, name: 'Pliage épaule', minAngle: -159.6, maxAngle: 159.6, bone : 0, rotation_type: 0},
  { id: 3, name: 'Rotation coude', minAngle: -159.6, maxAngle: 159.6 },
  { id: 4, name: 'Pliage coude', minAngle: -159.6, maxAngle: 159.6 },
  { id: 5, name: 'Rotation main', minAngle: -159.8, maxAngle: 159.8 },
  { id: 6, name: 'Pliage main', minAngle: -159.8, maxAngle: 159.8 },
  { id: 7, name: 'Pliage Pouce', minAngle: -159.8, maxAngle: 159.8 }
];