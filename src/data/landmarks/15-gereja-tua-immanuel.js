import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "gereja-tua-immanuel",
  name: "Gereja Tua Immanuel",
  modelUri: model("gereja_tua_immanuel.glb"),
  audioUri: audio("gereja_tua_immanuel.mp3"),
  latitude: -3.583103962725441,
  longitude: 128.08388902204044,
  mapScale: scaled(0.3),
  popupScale: popup(4.5),
  objectPosition: [0, -0.15, 0],
  zIndex: 0,
  island: "Maluku",
  environmentPreset: "city",
  //streetViewUrl: Gada street view untuk gereja tua immanuel
  description:
    "Gereja Tua Immanuel Hila awalnya didirikan oleh bangsa Portugis pada tahun 1514 sebagai kapel Katolik, kemudian diambil alih dan dibangun ulang oleh Belanda pada tahun 1780 dengan nama Immanuel. Bangunan ini menjadi simbol toleransi karena dijaga oleh komunitas Muslim setempat saat konflik 1999 dan memiliki arsitektur kayu vernakular yang sederhana namun tahan gempa.",
  annotations: [
    {
      id: 1,
      position: [0, 2.5, 2.5],
      title: "Dinding Kayu Tanpa Paku",
      description:
        "Konstruksi utama gereja ini terbuat dari kayu tanpa menggunakan paku logam modern, melainkan menggunakan sistem pasak (paku kayu) yang membuatnya lentur dan tahan terhadap guncangan gempa. Pada setiap sisi dinding terdapat tiga jendela tinggi dan ramping yang menjadi ciri khas ventilasi bangunan kolonial tropis.",
    },
    {
      id: 2,
      position: [0, 6.5, 0],
      title: "Atap Pelana Sederhana",
      description:
        "Atap gereja ini menggunakan desain pelana sederhana yang membantu mengalirkan air hujan dengan efektif dan memberikan kesan estetika yang khas pada bangunan kayu vernakular.",
    },
    {
      id: 3,
      position: [5, 1.5, 2],
      title: "Pintu Utama & Plakat",
      description:
        "Pintu masuk utama gereja menghadap langsung ke jalan dan area Benteng Amsterdam. Di bagian depan terdapat plakat yang menandakan tahun renovasi besar oleh Gubernur Jenderal Bernardus van Pleuren pada tahun 1780-1781.",
    },
  ],
};
