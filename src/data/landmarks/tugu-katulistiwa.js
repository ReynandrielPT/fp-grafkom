import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "tugu-katulistiwa",
  name: "Tugu Katulistiwa",
  modelUri: model("tugu_katulistiwa_3d.glb"),
  audioUri: audio("testing-sound.mp3"),
  latitude: 0.02618,
  longitude: 109.3425,
  mapScale: scaled(0.4),
  popupScale: popup(4),
  zIndex: 0,
  island: "Kalimantan",
  environmentPreset: "city",
  streetViewUrl:
    "https://www.google.com/maps/embed?pb=!4v1765461706721!6m8!1m7!1sFDSNwORY0gaz-IhS3bAJYQ!2m2!1d0.00128176250041357!2d109.322353480239!3f218.28857222550897!4f7.979226612761195!5f0.7820865974627469",
  description: "Monumen ikonik yang menandai titik nol derajat garis lintang bumi. Di lokasi ini, pengunjung dapat merasakan fenomena unik saat bayangan benda menghilang sempurna ketika matahari tepat berada di atas kepala (kulminasi).",
  annotations: [
    {
      id: 1,
      position: [-2.5, 7, 0],
      title: "Simbol Panah & Bola Dunia",
      description: "Anak panah dan lingkaran di puncak tugu ini menunjukkan orientasi arah Utara-Selatan yang sejajar sempurna dengan poros rotasi bumi. Bagian ini menjadi penanda visual utama garis imajiner ekuator.",
    },
    {
      id: 2,
      position: [0.5, 1.2, 0.5],
      title: "Kubah Pelindung (1990)",
      description: "Bangunan besar yang terlihat dari luar ini sebenarnya adalah replika pelindung yang dibangun tahun 1990. Ukurannya 5 kali lebih besar dari tugu asli untuk melindungi situs sejarah di dalamnya dari cuaca.",
    },
  ],
};
