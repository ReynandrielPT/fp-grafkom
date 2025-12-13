import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "masjid-raya-sumbar",
  name: "Masjid Raya Sumatera Barat",
  modelUri: model("masjid_raya_sumatera_barat.glb"),
  audioUri: audio("testing-sound.mp3"),
  latitude: -0.947083,
  longitude: 100.417181,
  mapScale: scaled(0.04),
  popupScale: popup(0.5),
  zIndex: 0,
  island: "Sumatra",
  environmentPreset: "city",
  streetViewUrl:
    "https://www.google.com/maps/embed?pb=!4v1765461886474!6m8!1m7!1skIGIciRKfIN00XzedCus0g!2m2!1d-0.9242044802386984!2d100.3615857776425!3f99.99839275275166!4f19.69264924425525!5f0.7820865974627469",
  description: "Masjid tanpa kubah ini menampilkan arsitektur modern yang mengadaptasi atap bagonjong Rumah Gadang sekaligus menyimbolkan bentangan kain sorban Nabi Muhammad SAW. Bangunan ini dirancang khusus dengan konstruksi tahan gempa magnitudo 10 dan berfungsi sebagai tempat evakuasi (shelter) tsunami.",
  annotations: [
    {
      id: 1,
      position: [50, 65, 70],
      title: "Atap Gonjong",
      description: "Desain atap ini tidak menggunakan kubah, melainkan interpretasi modern dari atap bagonjong Rumah Gadang. Empat sudut lancipnya melambangkan bentangan kain sorban yang dipegang oleh empat kabilah Quraisy saat memindahkan Hajar Aswad bersama Nabi Muhammad SAW.",
    },
    {
      id: 2,
      position: [70, 40, 0],
      title: "Fasad Ukiran Minang",
      description: "Dinding bangunan dibalut lapisan kulit kedua (secondary skin) dengan motif ukiran pucuak rabuang (pucuk rebung) khas Minangkabau. Selain estetika, celah-celah pada motif ini berfungsi sebagai ventilasi alami agar udara sejuk dapat bersirkulasi ke dalam masjid tanpa pendingin buatan.",
    },
    {
      id: 3,
      position: [30, 22, 100],
      title: "Zona Evakuasi & Struktur Tahan Gempa",
      description: "Masjid ini ditopang oleh fondasi kuat dengan kolom beton miring yang dirancang tahan gempa hingga magnitudo 10. Bagian lantai dasarnya sengaja dibuat terbuka (tanpa dinding masif) dan luas agar dapat difungsikan sebagai tempat perlindungan (shelter) yang aman bagi masyarakat jika terjadi tsunami.",
    },
  ],
};
