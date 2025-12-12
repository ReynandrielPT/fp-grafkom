import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "monas-jakarta",
  name: "Monumen Nasional (Monas)",
  modelUri: model("monas.glb"),
  audioUri: audio("testing-sound.mp3"),
  latitude: -6.175392,
  longitude: 106.827153,
  mapScale: scaled(1.8),
  popupScale: popup(20),
  zIndex: 0,
  island: "Jawa",
  environmentPreset: "park",
  streetViewUrl:
    "https://www.google.com/maps/embed?pb=!4v1765461461500!6m8!1m7!1sY80yDybYlYoCXUoSJiWc4w!2m2!1d-6.176014352612871!2d106.826944265311!3f19.594093660694654!4f29.255613321183887!5f0.7820865974627469",
  description:
    "Monumen Nasional (Monas) adalah tugu peringatan setinggi 132 meter yang didirikan untuk mengenang perlawanan rakyat Indonesia merebut kemerdekaan.",
  annotations: [
    {
      id: 1,
      position: [0, 2, 0],
      title: "Lidah Api Kemerdekaan",
      description:
        "Terbuat dari perunggu seberat 14,5 ton berlapis emas murni. Melambangkan semangat perjuangan yang tak pernah padam.",
    },
    {
      id: 2,
      position: [0.2, 1.2, 0],
      title: "Pelataran Puncak",
      description:
        "Terletak di ketinggian 115 meter. Pengunjung dapat melihat panorama kota Jakarta hingga Kepulauan Seribu.",
    },
    {
      id: 3,
      position: [0, -0.5, 0.4],
      title: "Pelataran Cawan",
      description:
        "Berada di ketinggian 17 meter, mencerminkan 'Yoni'. Menyimpan naskah asli Proklamasi.",
    },
    {
      id: 4,
      position: [0.8, -1.05, 0],
      title: "Museum Sejarah Nasional",
      description:
        "Ruangan besar berlapis marmer di dasar monumen yang memiliki 51 diorama sejarah Indonesia.",
    },
  ],
};
