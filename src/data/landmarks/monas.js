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
  audioUri: audio("monas.mp3"),
  latitude: -6.175392,
  longitude: 106.827153,
  mapScale: scaled(1.8),
  popupScale: popup(20),
  objectPosition: [0, -0.15, 0],
  zIndex: 0,
  island: "Jawa",
  environmentPreset: "park",
  streetViewUrl:
    "https://www.google.com/maps/embed?pb=!4v1765461461500!6m8!1m7!1sY80yDybYlYoCXUoSJiWc4w!2m2!1d-6.176014352612871!2d106.826944265311!3f19.594093660694654!4f29.255613321183887!5f0.7820865974627469",
  description:
    "Monumen Nasional (Monas) adalah tugu peringatan setinggi 132 meter yang dibangun atas gagasan Presiden Soekarno untuk mengabadikan semangat perjuangan rakyat Indonesia. Arsitekturnya yang khas memadukan konsep modern dengan filosofi kuno 'Lingga dan Yoni', yang melambangkan kesuburan serta keharmonisan abadi.",
  annotations: [
    {
      id: 1,
      position: [0, 2, 0],
      title: "Lidah Api Kemerdekaan",
      description:
        "Struktur perunggu setinggi 14 meter ini dilapisi emas murni yang beratnya kini mencapai 72 kilogram. Bentuk api yang terus berkobar melambangkan tekad dan semangat perjuangan bangsa Indonesia yang menyala-nyala dan tidak akan pernah padam.",
    },
    {
      id: 2,
      position: [0.2, 1.2, 0],
      title: "Pelataran Puncak",
      description:
        "Terletak di ketinggian 115 meter, area observasi seluas 11x11 meter ini dapat diakses menggunakan elevator tunggal. Dari titik ini, pengunjung dapat menikmati panorama 360 derajat kota Jakarta, bahkan hingga Gunung Salak dan Kepulauan Seribu saat cuaca cerah.",
    },
    {
      id: 3,
      position: [0, -0.5, 0.4],
      title: "Pelataran Cawan & Ruang Kemerdekaan",
      description:
        "Berada di ketinggian 17 meter, struktur cawan ini melambangkan 'Yoni' (wanita) yang menjadi dasar bagi tugu 'Lingga' (pria). Di bagian dalamnya terdapat Ruang Kemerdekaan berbentuk amphitheater yang menyimpan simbol kenegaraan, termasuk naskah asli Proklamasi dan peta kepulauan Nusantara berlapis emas.",
    },
    {
      id: 4,
      position: [0.8, -1.05, 0],
      title: "Museum Sejarah Nasional",
      description:
        "Ruangan luas berlapis marmer yang terletak 3 meter di bawah permukaan tanah ini memiliki ukuran 80x80 meter. Di dalamnya terdapat 51 diorama yang menceritakan rentetan sejarah bangsa, mulai dari zaman prasejarah, masa kerajaan, era penjajahan, hingga masa pembangunan pasca-kemerdekaan.",
    },
  ],
};
