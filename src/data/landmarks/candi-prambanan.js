import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "candi-prambanan",
  name: "Candi Prambanan",
  modelUri: model("candi_prambanan.glb"),
  audioUri: audio("candi_prambanan.mp3"),
  latitude: -7.852222,
  longitude: 110.491667,
  mapScale: scaled(5.8),
  popupScale: popup(150),
  objectPosition: [0, -0.15, 0],
  zIndex: 0,
  island: "Jawa",
  environmentPreset: "forest",
  streetViewUrl:
    "https://www.google.com/maps/embed?pb=!4v1764685566710!6m8!1m7!1szoywrhCLZWVhuEQb0wwRkg!2m2!1d-7.752211992764268!2d110.4921424240987!3f259.0937385099725!4f-5.50280768510838!5f0.4000000000000002",
  description:
    "Kompleks candi Hindu terbesar di Indonesia ini dipersembahkan untuk Trimurti dan terkenal dengan menara utamanya yang menjulang setinggi 47 meter. Keindahannya diperkaya oleh relief kisah Ramayana dan legenda Roro Jonggrang yang melekat kuat dalam sejarah budaya Jawa.",
  annotations: [
    {
      id: 1,
      position: [0, 0.42, -0.001],
      title: "Puncak (Ratna)",
      description:
        "Bagian atap berbentuk 'Ratna' (permata) yang melambangkan alam para Dewa. Berbeda dengan stupa pada candi Buddha, Ratna adalah ciri khas candi Hindu beraliran Siwa.",
    },
    {
      id: 2,
      position: [0, -0.2, 0.32],
      title: "Pintu Masuk",
      description:
        "Bilik utama yang menghadap ke timur. Di dalamnya bersemayam arca Siwa Mahadewa setinggi 3 meter yang berdiri di atas Yoni berbentuk teratai.",
    },
    {
      id: 3,
      position: [0.35, -0.25, 0],
      title: "Relief",
      description: "Ukiran cerita Ramayana.",
    },
  ],
};
