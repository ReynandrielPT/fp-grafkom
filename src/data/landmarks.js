import { resolveAssetPath } from "../utils/assets";
import { DEFAULT_LANDMARKS_SCALE } from "../components/const";

const model = (file) => resolveAssetPath(`model/${file}`);
const scaled = (multiplier = 1) => DEFAULT_LANDMARKS_SCALE * multiplier;

const baseLandmarks = [
  { // 1
    id: "monas-jakarta",
    name: "Monumen Nasional (Monas)",
    modelUri: model("monas.glb"),
    latitude: -6.175392,
    longitude: 106.827153,
    scale: scaled(1.8),
    zIndex: 0,
    description:
      "Monumen Nasional is Jakarta's national monument built to commemorate Indonesia's independence; it is a symbol of the nation's struggle and a popular civic landmark.",
    island: "Java",
  },
  { // 2
    id: "candi-prambanan",
    name: "Candi Prambanan",
    modelUri: model("candi_prambanan.glb"),
    latitude: -7.852222,
    longitude: 110.491667,
    scale: scaled(6),
    zIndex: 0,
    description:
      "Candi Prambanan is a 9th-century Hindu temple complex in Central Java, celebrated for its tall, pointed architecture and richly carved reliefs.",
    island: "Java",
  },
  { // 3
    id: "borobudur",
    name: "Candi Borobudur",
    modelUri: model("borobudur.glb"),
    latitude: -7.607874,
    longitude: 110.203751,
    scale: scaled(4),
    zIndex: 0,
    description:
      "Candi Borobudur is a monumental 8th–9th century Mahayana Buddhist temple in Central Java, known for its stupas and extensive stone reliefs.",
    island: "Java",
  },
  { // 4
    id: "monumen-kapsul-waktu",
    name: "Monumen Kapsul Waktu",
    modelUri: model("monumen_kapsul_waktu.glb"),
    // location: Merauke, Papua
    latitude: -8.51,
    longitude: 140.355,
    scale: scaled(0.4),
    zIndex: 0,
    description:
      "Monumen Kapsul Waktu (Time Capsule Monument) in Merauke commemorates a local historical moment; this entry places it in Papua for exploration and transport animations.",
    island: "Papua",
  },
  { // 5
    id: "tugu-katulistiwa",
    name: "Tugu Katulistiwa (Equator Monument)",
    modelUri: model("tugu_katulistiwa_3d.glb"),
    latitude: 0.02618,
    longitude: 109.3425,
    scale: scaled(0.4),
    zIndex: 0,
    description:
      "Tugu Katulistiwa marks a point on the equator and is a local landmark often visited to learn about the Earth's geography and equatorial phenomena.",
    island: "Kalimantan",
  },
  { // 6
    id: "patung-suroboyo",
    name: "Patung Suroboyo",
    modelUri: model("patungsuroboyo.glb"),
    latitude: -7.257472,
    longitude: 112.752088,
    scale: scaled(0.04),
    zIndex: 0,
    description:
      "Patung Suroboyo is an iconic statue in Surabaya depicting a shark and a crocodile, symbols tied to the city's founding legend and civic identity.",
    island: "Java",
  },
  { // 7
    id: "museum-ampera",
    name: "Jembatan Ampera / Museum Ampera",
    modelUri: model("museum_ampera.glb"),
    latitude: -2.990934,
    longitude: 104.756371,
    scale: scaled(0.18),
    zIndex: 0,
    description:
      "The Ampera Bridge is a prominent landmark that spans the Musi River in Palembang; it is closely associated with the city's history and riverfront identity.",
    island: "Sumatra",
  },
  { // 8
    id: "masjid-raya-sumbar",
    name: "Masjid Raya Sumatera Barat",
    modelUri: model("masjid_raya_sumatera_barat.glb"),
    latitude: -0.947083,
    longitude: 100.417181,
    scale: scaled(0.04),
    zIndex: 0,
    description:
      "Masjid Raya Sumatera Barat is the grand mosque representing West Sumatran religious and cultural life, often noted for its regional architectural influences.",
    island: "Sumatra",
  },
  { // 9
    id: "jam-gadang",
    name: "Jam Gadang",
    modelUri: model("jam_gadang.glb"),
    latitude: -0.3055,
    longitude: 100.3693,
    scale: scaled(0.2),
    zIndex: 0,
    description:
      "Jam Gadang is a historic clock tower and central landmark of Bukittinggi, widely recognized as a cultural symbol of the city.",
    island: "Sumatra",
  },
  // {
  //   id: "candi-jabung",
  //   name: "Candi Jabung",
  //   modelUri: "/model/candi_jabung.glb",
  //   latitude: -7.544167,
  //   longitude: 112.7425,
  //   scale: scaled(0.2),
  //   zIndex: 0,
  // },
  {
    id: "candi-bahal",
    name: "Candi Bahal",
    modelUri: model("candi_bahal.glb"),
    latitude: 2.076944,
    longitude: 99.065278,
    scale: scaled(0.08),
    zIndex: 0,
    description:
      "Candi Bahal is an ancient temple complex in North Sumatra, part of the region's early medieval heritage and archaeological sites.",
    island: "Sumatra",
  },
  {
    id: "candi-apit",
    name: "Candi Apit",
    modelUri: model("candi_apit.glb"),
    latitude: -0.503333,
    longitude: 101.41,
    scale: scaled(0.4),
    zIndex: 0,
    description:
      "Candi Apit is a historic temple site of local significance, representing Indonesia's rich archaeological and cultural landscape.",
    island: "Sumatra",
  },
];

export const landmarks = baseLandmarks.map((landmark, index) => ({
  ...landmark,
  displayIndex: index + 1,
}));
