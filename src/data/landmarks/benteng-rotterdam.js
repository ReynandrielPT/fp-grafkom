import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "benteng-rotterdam",
  name: "Benteng Rotterdam",
  modelUri: model("benteng_rotterdam.glb"),
  audioUri: audio("testing-sound.mp3"),
  latitude: -5.132890,
  longitude: 119.405789,
  mapScale: scaled(0.02),
  popupScale: popup(4),
  zIndex: 0,
  island: "Sulawesi",
  environmentPreset: "city",
  streetViewUrl:
    "https://www.google.com/maps/embed?pb=!4v1716301234567!6m8!1m7!1sCAoSLEFGMVFpcE5xRDZqX0ZqX0ZqX0Zq!2m2!1d-5.132890!2d119.405789!3f120!4f0!5f0.7820865974627469",
  description: "Benteng Rotterdam adalah benteng peninggalan Kerajaan Gowa-Tallo yang kemudian dibangun kembali oleh Belanda di Makassar. Bentuknya menyerupai penyu yang merangkak ke laut.",
  annotations: [
    {
      id: 1,
      position: [0, 2, 0],
      title: "Dinding Benteng",
      description: "Dinding tebal yang mengelilingi benteng, saksi bisu sejarah panjang kota Makassar.",
    },
    {
      id: 2,
      position: [0, 1, 3],
      title: "Museum La Galigo",
      description: "Di dalam kompleks benteng terdapat museum yang menyimpan benda-benda bersejarah Sulawesi Selatan.",
    },
  ],
};
