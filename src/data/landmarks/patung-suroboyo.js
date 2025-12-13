import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "patung-suroboyo",
  name: "Patung Suroboyo",
  modelUri: model("patungsuroboyo.glb"),
  audioUri: audio("testing-sound.mp3"),
  latitude: -7.257472,
  longitude: 112.752088,
  mapScale: scaled(0.04),
  popupScale: popup(0.4),
  zIndex: 0,
  island: "Jawa",
  environmentPreset: "city",
  streetViewUrl:
    "https://www.google.com/maps/embed?pb=!4v1764686946158!6m8!1m7!1sU5KPl00P7fV-6Q9YrW_r8A!2m2!1d-7.295867571669762!2d112.7386262620106!3f157.7543!4f0!5f0.7820865974627469",
  description: "Patung ini adalah simbol asal-usul nama 'Surabaya' (Sura: Berani, Baya: Bahaya) yang bermakna 'berani menghadapi bahaya'. Filosofi pertarungan ini mencerminkan semangat juang 'Arek-arek Suroboyo' yang pantang menyerah, selaras dengan julukan Kota Pahlawan.",
  annotations: [
    {
      id: 1,
      position: [-8, 90, 10],
      title: "Sura (Ikan Hiu)",
      description: "Melambangkan penguasa laut yang ganas. Dalam konteks sejarah, ini merepresentasikan kekuatan maritim Surabaya sebagai kota pelabuhan utama yang siap menghadang ancaman dari laut.",
      occlude: false,
    },
    {
      id: 2,
      position: [15, 70, 0],
      title: "Baya (Buaya)",
      description: "Melambangkan penguasa sungai/darat yang tangguh. Sosok ini merepresentasikan ketahanan warga kota dalam mempertahankan wilayahnya, seperti buaya yang tidak akan melepaskan mangsanya.",
      occlude: false,
    },
  ],
};
