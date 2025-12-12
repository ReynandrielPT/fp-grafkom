import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "monumen-kapsul-waktu",
  name: "Monumen Kapsul Waktu",
  modelUri: model("monumen_kapsul_waktu.glb"),
  audioUri: audio("testing-sound.mp3"),
  latitude: -8.51,
  longitude: 140.355,
  mapScale: scaled(0.4),
  popupScale: popup(2.5),
  zIndex: 0,
  island: "Papua",
  environmentPreset: "park",
  streetViewUrl:
    "https://www.google.com/maps/embed?pb=!4v1765461619249!6m8!1m7!1sCAoSHENJQUJJaEJBc3Zhc0lEUWpZcUFLcjA1dzR6ZlY.!2m2!1d-8.508176721821123!2d140.4121975531084!3f298.63194580731266!4f-1.823888927748314!5f0.7820865974627469",
  description: "Monumen impian Indonesia 2085 di Merauke.",
  annotations: [
    {
      id: 1,
      position: [0, 2, -4],
      title: "Struktur Utama (Perisai Papua)",
      description: "Bangunan ini dirancang oleh arsitek Yori Antar dengan mengadopsi bentuk huruf \"A\" (Alpha) dan menyerupai perisai perang khas suku Papua. Dimensi strukturnya melambangkan tanggal kemerdekaan Indonesia, yaitu lebar 17 meter, tinggi 8 meter, dan panjang 45 meter.",
    },
    {
      id: 2,
      position: [0, 5, 8],
      title: "Inti Kapsul Waktu",
      description: "Terletak tepat di tengah monumen, bagian ini adalah wadah penyimpanan tabung kapsul yang berisi \"7 Mimpi Anak Bangsa\" yang dikumpulkan dari 34 provinsi. Kapsul ini dilas secara permanen dan dijadwalkan untuk dibuka kembali pada tahun 2085.",
    },
    {
      id: 3,
      position: [2, 2, 0.8],
      title: "Lima Akses Masuk",
      description: "Monumen ini memiliki 5 jalur akses masuk yang merepresentasikan lima sila dalam Pancasila sebagai dasar negara Indonesia. Jalur-jalur ini menuntun pengunjung dari berbagai sisi menuju ke titik pusat tempat kapsul disimpan.",
    },
    {
      id: 4,
      position: [7.5, 2.5, 0],
      title: "Relief Perjalanan Bangsa",
      description: "Di sepanjang dinding bagian dalam menuju pusat, terdapat hiasan relief yang menggambarkan perjalanan sejarah Indonesia dan kebudayaan Papua. Relief ini berfungsi sebagai narasi visual yang mengiringi langkah pengunjung menuju visi masa depan di titik tengah.",
    },
  ],
};
