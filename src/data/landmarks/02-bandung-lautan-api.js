import { resolveAssetPath } from "../../utils/assets";
import { LANDMARK } from "../../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const audio = (file) => resolveAssetPath(`music/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

export default {
  id: "bandung-lautan-api",
  name: "Monumen Bandung Lautan Api",
  modelUri: model("bandung_lautan_api.glb"),
  audioUri: audio("bandung_lautan_api.mp3"),
  latitude: -6.935105,
  longitude: 107.604134,
  mapScale: scaled(0.06),
  popupScale: popup(1),
  objectPosition: [0, -0.15, 0],
  zIndex: 0,
  island: "Jawa",
  environmentPreset: "park",
  streetViewUrl:
    "https://www.google.com/maps/embed?pb=!4v1765715860211!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRDYyTmJrandF!2m2!1d-6.933849682302988!2d107.6049249940589!3f351.71704487164124!4f13.938193587969764!5f0.7820865974627469",
  description:
    "Monumen yang dibangun di Lapangan Tegallega untuk memperingati peristiwa Bandung Lautan Api, di mana para pejuang membumihanguskan kota Bandung agar tidak dikuasai oleh sekutu.",
  annotations: [
    {
      id: 1,
      position: [-6, 681, 30],
      title: "Kobaran Api",
      description:
        "Bentuk stilasi api di puncak monumen melambangkan semangat perjuangan rakyat Bandung yang terus menyala dan tak pernah padam.",
      visual_cue: "Ujung tertinggi monumen yang berwarna kekuningan/emas.",
    },
    {
      id: 2,
      position: [-4, 670, 34],
      title: "Tiga Pilar Penyangga",
      description:
        "Tiga pilar kokoh yang menopang api melambangkan kesatuan antara rakyat, ulama/tokoh agama, dan pejuang/tentara dalam mempertahankan kemerdekaan.",
      visual_cue: "Batang vertikal utama yang menopang api.",
    },
    {
      id: 3,
      position: [0, 664, 20],
      title: "Pelataran Konsentris",
      description:
        "Pola lingkaran yang memusat ke arah tiang utama, menggambarkan fokus dan kebulatan tekad seluruh elemen masyarakat menuju satu tujuan: Kemerdekaan.",
      visual_cue: "Area lantai berbentuk lingkaran gelap di dasar tiang.",
    },
  ],
};
