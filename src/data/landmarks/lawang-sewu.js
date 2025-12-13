import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "lawang-sewu",
  name: "Lawang Sewu",
  modelUri: model("lawang_sewu.glb"),
  audioUri: audio("lawang_sewu.mp3"),
  latitude: -6.983949,
  longitude: 110.410434,
  mapScale: scaled(0.2),
  popupScale: popup(3),
  objectPosition: [0, -0.15, 0],
  zIndex: 0,
  island: "Jawa",
  environmentPreset: "city",
  streetViewUrl:
    "https://www.google.com/maps/embed?pb=!4v1716301234567!6m8!1m7!1sCAoSLEFGMVFpcE5xRDZqX0ZqX0ZqX0Zq!2m2!1d-6.983949!2d110.410434!3f120!4f0!5f0.7820865974627469",
  description:
    "Lawang Sewu ('Seribu Pintu') adalah gedung bersejarah di Semarang yang dulunya merupakan kantor pusat Nederlands-Indische Spoorweg Maatschappij (NIS). Bangunan ini terkenal dengan arsitekturnya yang megah, jumlah pintunya yang sangat banyak, dan sistem ventilasi bawah tanahnya.",
  annotations: [
    {
      id: 1,
      position: [0, 6, 0.8], // Koordinat di atas Menara
      title: "Menara Kembar Utama",
      description:
        "Bagian ikonik dengan kubah tembaga yang mengapit pintu masuk utama. Di dalamnya terdapat tangga agung dengan kaca patri besar karya J.L. Schouten.",
    },
    {
      id: 2,
      position: [12, 1, -8], // Koordinat di deretan pintu sayap bangunan
      title: "Serambi & Pintu",
      description:
        "Deretan pintu dan jendela tinggi (arcade) yang didesain untuk sirkulasi udara maksimal. Banyaknya lorong ini menciptakan ilusi 'seribu pintu'.",
    },
    {
      id: 3,
      position: [-3.8, 5.5, 0.5], // Koordinat di atas atap genteng
      title: "Sirkulasi Atap (Dormer)",
      description:
        "Ventilasi kecil yang menonjol di atap untuk membuang hawa panas dari langit-langit, menjaga suhu ruangan tetap sejuk.",
    },
    {
      id: 4,
      position: [5.5, 1, 1], // Koordinat di dinding tengah antara dua menara
      title: "Kaca Patri",
      description:
        "Terletak di dinding tengah, kaca patri indah ini menggambarkan simbol kemakmuran alam Jawa dan kejayaan kereta api Belanda.",
    },
  ],
};
