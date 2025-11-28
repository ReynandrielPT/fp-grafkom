import { COORDINATE_BOUNDS, LANDMARK } from "../config/mapConfig";

/**
 * Converts latitude and longitude to 3D world position
 * @param {number} latitude - Geographic latitude
 * @param {number} longitude - Geographic longitude
 * @param {Object} mapBounds - Map boundaries with min/max x/y/z
 * @param {number} [zIndexOffset=0] - Additional z-index offset
 * @returns {[number, number, number]|null} World position [x, y, z] or null if invalid
 */
export function latLonToWorldPosition(latitude, longitude, mapBounds, zIndexOffset = 0) {
  if (!mapBounds || latitude == null || longitude == null) {
    return null;
  }

  const width = mapBounds.max.x - mapBounds.min.x;
  const depth = mapBounds.max.z - mapBounds.min.z;

  const longitudeRatio = 
    (longitude - COORDINATE_BOUNDS.LON_MIN) / 
    (COORDINATE_BOUNDS.LON_MAX - COORDINATE_BOUNDS.LON_MIN);
  
  const latitudeRatio = 
    (latitude - COORDINATE_BOUNDS.LAT_MIN) / 
    (COORDINATE_BOUNDS.LAT_MAX - COORDINATE_BOUNDS.LAT_MIN);

  const clampedLonRatio = Math.max(0, Math.min(1, longitudeRatio));
  const clampedLatRatio = Math.max(0, Math.min(1, latitudeRatio));

  const x = mapBounds.min.x + clampedLonRatio * width;
  const z = mapBounds.max.z - clampedLatRatio * depth + zIndexOffset;
  const y = mapBounds.min.y + 
    (mapBounds.max.y - mapBounds.min.y) * 0.01 + 
    LANDMARK.GLOBAL_Y_OFFSET;

  return [x, y, z];
}

/**
 * Checks if two 3D positions are approximately the same
 * @param {Array<number>} pos1 - First position [x, y, z]
 * @param {Array<number>} pos2 - Second position [x, y, z]
 * @param {number} [tolerance=0.001] - Distance tolerance
 * @returns {boolean} True if positions are within tolerance
 */
export function isSamePosition(pos1, pos2, tolerance = 0.001) {
  if (!pos1 || !pos2 || pos1.length !== 3 || pos2.length !== 3) {
    return false;
  }
  
  return Math.abs(pos1[0] - pos2[0]) < tolerance &&
         Math.abs(pos1[1] - pos2[1]) < tolerance &&
         Math.abs(pos1[2] - pos2[2]) < tolerance;
}

/**
 * Checks if the target element is a typing input
 * @param {HTMLElement} target - DOM element to check
 * @returns {boolean} True if element accepts text input
 */
export function isTypingTarget(target) {
  if (!target) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target?.isContentEditable
  );
}
