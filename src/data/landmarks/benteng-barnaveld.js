import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "benteng-barnaveld",
  name: "Benteng Barnaveld",
  modelUri: model("benteng_barnaveld.glb"),
  audioUri: audio("benteng_barnaveld.mp3"),
  latitude: -0.35958626938027927,
  longitude: 127.51517860608296,
  mapScale: scaled(0.1),
  popupScale: popup(1.2),
  zIndex: 0,
  island: "Maluku",
  environmentPreset: "forest",
  //streetViewUrl: # Gada street view untuk benteng barnaveld
  description:
    "Benteng Barnaveld adalah benteng pertahanan pesisir berbentuk segi empat yang didirikan Portugis pada tahun 1558 dan kemudian direnovasi Belanda menggunakan material batu karang untuk mengamankan jalur perdagangan rempah. Struktur ini diperkuat dengan empat bastion sudut berbentuk mata panah yang menjadikannya simbol kekuatan militer kolonial strategis di wilayah Kesultanan Bacan",
  annotations: [
    {
      id: 1,
      position: [18, 6, 15],
      title: "Empat Bastion Sudut",
      description:
        "Benteng ini memiliki empat bastion di setiap sudutnya yang awalnya dibangun menggunakan batu dan diisi tanah padat. Bentuk bastion yang runcing seperti mata panah ini memungkinkan pasukan menempatkan meriam untuk menembak ke segala arah tanpa titik buta.",
    },
    {
      id: 2,
      position: [15, 3, 15],
      title: "Dinding Batu Karang",
      description:
        "Dinding setinggi kurang lebih 4 meter ini disusun menggunakan material lokal berupa bongkahan batu karang laut dan perekat kapur dengan ketebalan mencapai 60 cm. Tekstur dinding yang kasar dan tidak rata ini merupakan karakteristik khas benteng di Maluku yang memanfaatkan sumber daya alam pesisir untuk konstruksi yang sangat keras.",
    },
    {
      id: 3,
      position: [-10, 1, 7],
      title: "Gerbang Utama",
      description:
        "Akses tunggal menuju bagian dalam benteng berupa lorong pintu gerbang pelengkung yang menembus ketebalan dinding pertahanan. Pada masa aktifnya, area di atas lengkungan gerbang ini biasanya memuat inskripsi tahun pembuatan atau lambang VOC sebagai penanda kekuasaan.",
    },
    {
      id: 4,
      position: [-15, 1, 7],
      title: "Parit Keliling",
      description:
        "Di sekeliling dinding luar benteng terdapat jejak parit selebar 2 meter yang dahulu digali untuk menghambat laju serangan pasukan infanteri musuh sebelum mencapai dinding utama.",
    },
  ],
};
