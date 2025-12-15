import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "benteng-rotterdam",
  name: "Benteng Rotterdam",
  modelUri: model("benteng_rotterdam.glb"),
  audioUri: audio("benteng_rotterdam.mp3"),
  latitude: -5.13289,
  longitude: 119.405789,
  mapScale: scaled(0.02),
  popupScale: popup(4),
  objectPosition: [0, -0.15, 0],
  zIndex: 0,
  island: "Sulawesi",
  environmentPreset: "city",
  streetViewUrl:
    "https://www.google.com/maps/embed?pb=!4v1765703214924!6m8!1m7!1sQghK_wqyOxS3ocrZ7sMmQw!2m2!1d-5.13366956494089!2d119.4047359069013!3f95.85022032269447!4f8.789699334645803!5f0.7820865974627469",
  description:
    "Benteng Rotterdam adalah benteng peninggalan Kerajaan Gowa-Tallo yang kemudian dibangun kembali oleh Belanda di Makassar. Bentuknya menyerupai penyu yang merangkak ke laut, bentuk unik ini mengandung filosofi lokal bahwa Kerajaan Gowa berjaya di darat maupun di laut",
  annotations: [
    {
      id: 1,
      position: [-60, 25, 60],
      title: "Dinding Batu Karang",
      description:
        "Dinding pertahanan setinggi 5-7 meter ini tidak hanya disusun dari batu bata, tetapi juga memanfaatkan batu padas dan karang laut yang direkatkan dengan campuran kapur untuk memperkuat struktur. Ketebalan dinding yang mencapai 2 meter dirancang khusus untuk menahan gempuran meriam kapal musuh dari arah Selat Makassar.",
    },
    {
      id: 2,
      position: [0, 30, 10],
      title: "Museum La Galigo",
      description:
       "Bangunan-bangunan tua di dalam kompleks benteng (bekas barak dan gudang rempah) kini dialihfungsikan menjadi Museum La Galigo yang menyimpan ribuan koleksi sejarah dan etnografi Sulawesi Selatan. Salah satu gedung utamanya dahulu merupakan kediaman resmi Gubernur Jenderal Cornelis Speelman saat berkuasa di Makassar.",
    },
    {
      id: 3,
      position: [-100, 25, 0],
      title: "Lima Bastion \"Penyu\"",
      description:
        "Di setiap sudut benteng terdapat bastion yang dinamai sesuai wilayah taklukan sekutu Belanda: Bone, Bacan, Buton, Mandarasyah, dan Amboina. Kelima bastion ini membentuk anatomi \"kaki, kepala, dan ekor\" penyu, tempat meriam ditempatkan untuk melindungi benteng dari serangan segala arah.",
    },
    {
      id: 4,
      position: [80, 30, -70],
      title: "Penjara Pangeran Diponegoro",
      description:
        "Di area Bastion Bacan, terdapat sel sempit melengkung yang menjadi tempat pengasingan Pangeran Diponegoro oleh Belanda sejak tahun 1833 hingga wafatnya pada 1855. Ruangan ini sangat sederhana dengan pintu besi kokoh, menjadi saksi bisu hari-hari terakhir sang pahlawan Perang Jawa dalam isolasi.",
    },
  ],
};
