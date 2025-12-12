// Automatically import all landmark files from the landmarks directory
const landmarkModules = import.meta.glob('./*.js', { eager: true });

const baseLandmarks = Object.keys(landmarkModules)
  .filter(path => path !== './index.js') // Exclude index.js itself
  .map(path => landmarkModules[path].default)
  .filter(Boolean); // Remove any undefined values

export const landmarks = baseLandmarks.map((landmark, index) => ({
  ...landmark,
  displayIndex: index + 1,
}));
