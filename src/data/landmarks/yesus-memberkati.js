import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "yesus-memberkati",
  name: "Monumen Yesus Memberkati",
  modelUri: model("yesus_memberkati.glb"),
  audioUri: audio("testing-sound.mp3"),
  latitude: 1.442345,
  longitude: 124.841356,
  mapScale: scaled(0.2),
  popupScale: popup(2.0),
  zIndex: 0,
  island: "Sulawesi",
  environmentPreset: "city",
  streetViewUrl:
    "https://www.google.com/maps/embed?pb=!4v1716301234567!6m8!1m7!1sCAoSLEFGMVFpcE5xRDZqX0ZqX0ZqX0Zq!2m2!1d1.442345!2d124.841356!3f120!4f0!5f0.7820865974627469",
  description: "Patung Yesus Memberkati adalah monumen setinggi 50 meter yang terletak di Manado, Sulawesi Utara. Patung ini menghadap ke kota dan teluk Manado, melambangkan perlindungan dan kasih sayang.",
  annotations: [
    {
      id: 1,
      position: [2.5, -9.5, 27],
      title: "Wajah",
      description: "Menghadap ke arah kota Manado dengan ekspresi penuh kasih.",
    },
    {
      id: 2,
      position: [10, -9.5, 31],
      title: "Tangan Memberkati",
      description: "Pose tangan yang terangkat melambangkan berkat bagi seluruh penduduk kota.",
    },
  ],
};
