import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "museum-sultan-mahmud-badaruddin-ii",
  name: "Museum SMB II",
  modelUri: model("museum_sultan_mahmud_badaruddin_ii.glb"),
  audioUri: audio("testing-sound.mp3"),
  latitude: -2.990934,
  longitude: 104.756371,
  mapScale: scaled(0.18),
  popupScale: popup(2),
  zIndex: 0,
  island: "Sumatra",
  environmentPreset: "city",
  streetViewUrl:
    "https://www.google.com/maps/embed?pb=!4v1764688713755!6m8!1m7!1sLJShIXEzYd-HTCu9OlqemA!2m2!1d-2.990254882698889!2d104.761591389016!3f246.54443196615483!4f-3.6402656926313455!5f0.7820865974627469",
  description: "Museum ini menempati gedung bekas kediaman resmi Residen Belanda (1823-1825) yang didirikan tepat di atas reruntuhan Keraton Kuto Lamo milik Kesultanan Palembang. Arsitekturnya memadukan struktur tembok masif bergaya Eropa dengan bentuk atap Limas tradisional, menjadikannya simbol pertemuan dua budaya di tepian Sungai Musi.",
  annotations: [
    {
      id: 1,
      position: [0, 25, 0],
      title: "Atap Limasan",
      description: "Meskipun berdinding tembok Eropa, atap bangunan ini mempertahankan bentuk Limas (piramida terpotong) yang merupakan ciri khas arsitektur vernakular Palembang.",
    },
    {
      id: 2,
      position: [3, 5, 20],
      title: "Tangga Melengkung",
      description: "Fasad depan didominasi oleh dua tangga batu besar yang melengkung simetris menuju pintu masuk utama di lantai dua. Pada masa kolonial, tangga ini memiliki aturan ketat di mana satu sisi khusus untuk naik dan sisi lainnya untuk turun, serta jumlah anak tangganya dahulu menjadi penanda status sosial penghuni atau tamu.",
    },
    {
      id: 3,
      position: [10, 7, 17],
      title: "Fasad Gaya Indis",
      description: "Tubuh bangunan mencerminkan gaya Indische Empire dengan pilar-pilar Doric yang kokoh, plafon tinggi, dan deretan jendela besar (jalousie) untuk ventilasi maksimal. Berbeda dengan rumah tradisional Palembang yang berbahan kayu, struktur utama museum ini menggunakan material bata dan semen yang masif.",
    },
    {
      id: 4,
      position: [0, 1.5, 30],
      title: "Situs Keraton Kuto Lamo",
      description: "Bangunan ini berdiri di atas tanah bersejarah yang dahulu merupakan lokasi Keraton Kuto Lamo (istana lama) yang dihancurkan oleh Belanda pada tahun 1823 sebagai hukuman bagi Kesultanan. Material lantai bangunan museum ini konon sebagian diambil dari sisa-sisa puing keraton tersebut sebagai simbol penaklukan.",
    },
  ],
};
