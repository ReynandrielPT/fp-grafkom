import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "borobudur",
  name: "Candi Borobudur",
  modelUri: model("borobudur.glb"),
  audioUri: audio("borobudur.mp3"),
  latitude: -6.997187604486701,
  longitude: 113.43677127871455,
  mapScale: scaled(0.09),
  popupScale: popup(1.4),
  objectPosition: [0, -0.15, 0],
  zIndex: 0,
  island: "Jawa",
  environmentPreset: "forest",
  streetViewUrl:
    "https://www.google.com/maps/embed?pb=!4v1764686077281!6m8!1m7!1sArYnALlhMQ_Ni2Cf37_P3Q!2m2!1d-7.607994190665645!2d110.2043583718553!3f306.5484412804959!4f11.912834236912119!5f0.4000000000000002",
  description:
    "Candi Buddha terbesar di dunia ini merupakan mahakarya arsitektur Wangsa Syailendra yang menggambarkan tingkatan alam semesta (Kamadhatu, Rupadhatu, Arupadhatu) menuju Nirwana. Bangunan megah ini dihiasi ribuan relief naratif dan ratusan stupa berlubang yang memuncak pada satu stupa induk monumental.",
  annotations: [
    {
      id: 1,
      position: [0, 18, 0],
      title: "Stupa Utama",
      description:
        "Stupa utama merupakan simbol Nirvana dan berada di tingkat Arupadhatu, tanpa arca di dalamnya — menandakan kesempurnaan tertinggi dalam Buddhisme Mahayana. Stupa ini menjadi bagian paling akhir dari perjalanan ritual pradaksina yang dilakukan para peziarah.",
    },
    {
      id: 2,
      position: [6, 12, 0],
      title: "Stupa Berlubang",
      description:
        "Pada tiga teras melingkar di bagian atas, terdapat 72 stupa kecil berbentuk lonceng dengan dinding berlubang-lubang geometris (belah ketupat dan persegi). Di dalam setiap kurungan batu ini tersimpan arca Buddha yang duduk menyimbolkan pelepasan dari ikatan duniawi.",
    },
    {
      id: 3,
      position: [12, 9, 4],
      title: "Lorong Relief & Relung Arca (Rupadhatu)",
      description:
        "Zona tubuh candi ini terdiri dari lorong-lorong persegi yang dindingnya dipenuhi ribuan panel ukiran cerita suci, termasuk kisah kelahiran Buddha (Lalitavistara). Di sepanjang pagar langkannya, terdapat deretan relung terbuka berisi arca Buddha yang menghadap ke berbagai penjuru mata angin.",
    },
    {
      id: 4,
      position: [21.25, 1, -4],
      title: "Relief Karmawibhangga (Kaki Candi)",
      description:
        "Terletak di bagian paling dasar (Kamadhatu), relief ini menggambarkan hukum sebab-akibat moral manusia yang sebagian besar tertutup oleh struktur batu penguat kaki candi. Hanya bagian sudut Tenggara yang sengaja dibuka agar pengunjung dapat melihat pahatan asli tentang kehidupan duniawi dan dosanya.",
    },
  ],
};
