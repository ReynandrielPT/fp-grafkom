import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "candi-bahal",
  name: "Candi Bahal",
  modelUri: model("candi_bahal.glb"),
  audioUri: audio("testing-sound.mp3"),
  latitude: 2.076944,
  longitude: 99.065278,
  mapScale: scaled(0.08),
  popupScale: popup(1.2),
  zIndex: 0,
  island: "Sumatra",
  environmentPreset: "forest",
  streetViewUrl:
    "https://www.google.com/maps/embed?pb=!4v1765461965947!6m8!1m7!1shkg3rIh7J9CJZVjsvdUtgg!2m2!1d1.409069219503454!2d99.72634643927046!3f61.98735384457794!4f1.9845596589886156!5f0.7820865974627469",
  description: "Candi bata merah peninggalan Kerajaan Pannai.",
  annotations: [
    {
      id: 1,
      position: [-11, 13, 0],
      title: "Atap Dagoba",
      description: "Berbeda dengan candi di Jawa yang umumnya beratap stupa lonceng atau ratna, atap Candi Bahal I berbentuk silinder atau dagoba. Bentuk ini mencerminkan gaya arsitektur khas yang mirip dengan stupa di India Selatan atau Sri Lanka, dihiasi dengan pahatan untaian bunga yang melingkari tepiannya.",
    },
    {
      id: 2,
      position: [-11, 8, 4],
      title: "Struktur Bata Merah",
      description: "Seluruh bangunan candi, mulai dari kaki hingga puncak, dibangun menggunakan material batu bata merah, bukan batu andesit. Penggunaan bata merah ini menunjukkan kemajuan teknologi pembakaran tanah liat pada masa itu dan memberikan warna hangat yang kontras dengan lingkungan sekitarnya.",
    },
    {
      id: 3,
      position: [-10, 1, 6.5],
      title: "Relief Singa & Yaksa",
      description: "Pada bagian kaki candi, terdapat panel-panel relief yang menggambarkan Yaksa (makhluk mitologi) berkepala hewan yang sedang menari-nari dan singa yang duduk. Tarian ini sering dikaitkan dengan ritual Tantrayana (Bhairawa) yang ekspresif, berbeda dengan relief candi di Jawa yang cenderung tenang.",
    },
    {
      id: 4,
      position: [-8, 7, 0.5],
      title: "Bilik Utama",
      description: "Pintu masuk candi menghadap ke Timur dan menuntun ke sebuah ruangan kosong di dalam tubuh candi. Dahulu ruangan ini diperkirakan berisi arca suci, namun kini kosong. Bingkai pintu masuknya polos tanpa hiasan Kala-Makara yang rumit seperti pada candi Jawa umumnya.",
    },
  ],
};
