import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "yesus-memberkati",
  name: "Monumen Yesus Memberkati Manado",
  modelUri: model("yesus_memberkati.gltf"),
  audioUri: audio("yesus_memberkati.mp3"),
  latitude: 1.442345,
  longitude: 124.841356,
  mapScale: scaled(0.2),
  popupScale: popup(2.0),
  objectPosition: [0, -0.15, 0],
  zIndex: 0,
  island: "Sulawesi",
  environmentPreset: "city",
  streetViewUrl:
    "https://www.google.com/maps/embed?pb=!4v1765703744064!6m8!1m7!1s5DihTlvB_PT8eFs95NwJag!2m2!1d1.438534194424963!2d124.8474468294712!3f151.98938052681711!4f33.42140923960817!5f0.7820865974627469",
  description:
    "Monumen Yesus Memberkati Manado adalah monumen setinggi 50 meter yang terletak di Manado, Sulawesi Utara. Patung ini menghadap ke kota dan teluk Manado, melambangkan perlindungan dan kasih sayang.",
  annotations: [
    {
      id: 1,
      position: [2, 44, 15],
      title: "Wajah",
      description: "Menghadap ke arah kota Manado dengan ekspresi penuh kasih.",
    },
    {
      id: 2,
      position: [11, 46, 24],
      title: "Tangan Memberkati",
      description:
        "Pose tangan yang terangkat melambangkan berkat bagi seluruh penduduk kota Manado.",
    },
  ],
};
