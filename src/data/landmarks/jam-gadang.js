import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "jam-gadang",
  name: "Jam Gadang",
  modelUri: model("jam_gadang.glb"),
  audioUri: audio("jam_gadang.mp3"),
  latitude: -0.3055,
  longitude: 100.3693,
  mapScale: scaled(0.2),
  popupScale: popup(2),
  zIndex: 0,
  island: "Sumatra",
  environmentPreset: "city",
  streetViewUrl:
    "https://www.google.com/maps/embed?pb=!4v1764687420785!6m8!1m7!1spOH5K4Qyiq-kMs_90A-0WQ!2m2!1d-0.3050031606353411!2d100.3696770920085!3f218.6719470613562!4f11.33067463501665!5f0.7820865974627469",
  description:
    'Ikon Bukittinggi ini menyimpan mesin jam mekanik langka buatan Jerman yang hanya diproduksi dua unit di dunia, menjadikannya "kembaran" Big Ben di London. Atap menaranya yang unik telah mengalami tiga kali perubahan sejarah, kini berbentuk gonjong runcing yang merepresentasikan identitas Minangkabau.',
  annotations: [
    {
      id: 1,
      position: [2, 28, 0],
      title: "Atap Bagonjong",
      description:
        "Bentuk atap ini telah mengalami tiga kali perubahan mengikuti masa kekuasaan di Indonesia. Awalnya berbentuk kubah Eropa dengan patung ayam jantan (masa Belanda), berubah menjadi pagoda (masa Jepang), dan akhirnya menjadi atap bagonjong khas Minangkabau setelah kemerdekaan. Lengkungan atap ini menyimbolkan kemenangan dan identitas masyarakat setempat.",
    },
    {
      id: 2,
      position: [2, 22, 0],
      title: "Angka Unik 'IIII'",
      description:
        'Jika diperhatikan dengan seksama, angka 4 pada wajah jam ini tidak ditulis dengan format Romawi standar "IV", melainkan "IIII". Konon, penulisan ini dilakukan untuk keseimbangan visual atau menghindari kesalahpahaman makna "IV" (singkatan I Victory) yang dikhawatirkan memicu semangat perlawanan pada masa kolonial.',
    },
    {
      id: 3,
      position: [0, 15, 1],
      title: "Mesin Kembaran Big Ben",
      description:
        "Di balik wajah jam, terdapat mesin penggerak mekanik langka buatan Vortmann Recklinghausen (Jerman) tahun 1892. Mesin ini diproduksi terbatas dan diklaim hanya ada dua unit di dunia: satu di Jam Gadang dan satu lagi di menara Big Ben, London.",
    },
    {
      id: 4,
      position: [10, 3, 0],
      title: "Struktur Tanpa Besi",
      description:
        "Menara setinggi 26 meter ini dibangun tanpa menggunakan rangka besi ataupun semen modern. Perekat batu batanya menggunakan campuran tradisional yang terdiri dari kapur, pasir putih, dan putih telur, namun terbukti kokoh bertahan dari berbagai gempa besar yang melanda Sumatera Barat.",
    },
  ],
};
