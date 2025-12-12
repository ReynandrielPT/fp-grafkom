import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "museum-sultan-mahmud-badaruddin-ii",
  name: "Museum SMB II",
  modelUri: model("museum_sultan_mahmud_badaruddin_ii.glb"),
  audioUri: audio("testing-sound.mp3"),
  latitude: -2.990934,
  longitude: 104.756371,
  mapScale: scaled(0.18),
  popupScale: popup(2),
  zIndex: 0,
  island: "Sumatra",
  environmentPreset: "city",
  streetViewUrl:
    "https://www.google.com/maps/embed?pb=!4v1764688713755!6m8!1m7!1sLJShIXEzYd-HTCu9OlqemA!2m2!1d-2.990254882698889!2d104.761591389016!3f246.54443196615483!4f-3.6402656926313455!5f0.7820865974627469",
  description: "Museum sejarah Palembang di tepi Sungai Musi.",
  annotations: [
    {
      id: 1,
      position: [0, 1, 0],
      title: "Atap Limas",
      description: "Arsitektur lokal.",
    },
    {
      id: 2,
      position: [0, -0.5, 0.8],
      title: "Pintu Masuk",
      description: "Gerbang utama.",
    },
  ],
};
