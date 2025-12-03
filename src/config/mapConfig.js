/**
 * Map and 3D scene configuration constants
 */

// Indonesia Map Configuration
export const INDONESIA_MAP = {
  ROTATION: [-Math.PI / 2, 0, 0],
  SCALE: 60,
};

// Camera Configuration
export const CAMERA = {
  INDONESIA_POSITION: [0, 10, 12],
  INDONESIA_FOV: 20,
  MONUMENT_PREVIEW_POSITION: [0, 3.5, 14],
  MONUMENT_PREVIEW_FOV: 45,
};

// OrbitControls Configuration
export const ORBIT_CONTROLS = {
  MIN_DISTANCE: 2.5,
  MAX_DISTANCE: 25,
  DAMPING_FACTOR: 0.08,
  MONUMENT_MIN_DISTANCE: 2,
  MONUMENT_MAX_DISTANCE: 40,
};

// Landmark Display Configuration
export const LANDMARK = {
  DEFAULT_SCALE: 0.08,
  GLOBAL_Y_OFFSET: 0.12,
  LABEL_HEIGHT: 0.10,
  LABEL_FONT_SIZE: 0.28,
  LABEL_HITBOX_WIDTH: 0.3,
  LABEL_HITBOX_HEIGHT: 0.8,
};

// Monument Preview Configuration
export const MONUMENT_PREVIEW = {
  MODEL_SCALE: 0.1,
  MODEL_POSITION: [0, -0.8, 0],
};

// Animation Durations (in seconds)
export const ANIMATION = {
  CONTAINER_FADE_IN: 0.25,
  PANEL_OPEN: 0.35,
  PANEL_CLOSE: 0.28,
  CONTAINER_CLOSE: 0.2,
};

// Animation Positions
export const ANIMATION_POSITION = {
  PANEL_OPEN_Y: 0,
  PANEL_CLOSED_Y_OPEN: 36,
  PANEL_CLOSED_Y_CLOSE: 28,
  PANEL_CLOSED_SCALE: 0.92,
};

// Transport Animation Configuration
export const TRANSPORT = {
  PLANE_SPEED: 4.5, // world units per second
  TRAIN_SPEED: 2.8, // world units per second
  PLANE_SCALE: 0.014,
  TRAIN_SCALE: 0.012,
  TRAIN_Y_OFFSET: 0.2,
  KEYBOARD_MOVE_SPEED: 6, // world units per second for WASD panning
};

// Geographic Coordinate Bounds for Indonesia
export const COORDINATE_BOUNDS = {
  LAT_MIN: -12,
  LAT_MAX: 6,
  LON_MIN: 95,
  LON_MAX: 141,
};
