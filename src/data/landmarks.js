import { resolveAssetPath } from "../utils/assets";
import { LANDMARK } from "../config/mapConfig";

const model = (file) => resolveAssetPath(`model/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;
const popup = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

const baseLandmarks = [
  {
    // ========================================================
    // 1. MONUMEN NASIONAL (MONAS) - JAKARTA
    // ========================================================
    id: "monas-jakarta",
    name: "Monumen Nasional (Monas)",
    modelUri: model("monas.glb"),
    latitude: -6.175392,
    longitude: 106.827153,
    mapScale: scaled(1.8),
    popupScale: popup(20),
    zIndex: 0,
    island: "Jawa",
    environmentPreset: "park",
    streetViewUrl: "https://www.google.com/maps/embed?pb=!4v1764683815646!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJREUzclhOWEE.!2m2!1d-6.175035830309233!2d106.8271922828707!3f269.17352!4f0!5f0.7820865974627469",
    description:
      "Monumen Nasional (Monas) adalah tugu peringatan setinggi 132 meter yang didirikan untuk mengenang perlawanan rakyat Indonesia merebut kemerdekaan.",
    
    // KOORDINAT DARI KAMU (Sudah disesuaikan dengan Stage)
    annotations: [
      {
        id: 1,
        position: [0, 2, 0], // Paling atas (Lidah Api)
        title: "Lidah Api Kemerdekaan",
        description: "Terbuat dari perunggu seberat 14,5 ton berlapis emas murni. Melambangkan semangat perjuangan yang tak pernah padam.",
      },
      {
        id: 2,
        position: [0.2, 1.2, 0], // Pelataran Puncak
        title: "Pelataran Puncak",
        description: "Terletak di ketinggian 115 meter. Pengunjung dapat melihat panorama kota Jakarta hingga Kepulauan Seribu.",
      },
      {
        id: 3,
        position: [0, -0.5, 0.4], // Cawan
        title: "Pelataran Cawan",
        description: "Berada di ketinggian 17 meter, mencerminkan 'Yoni'. Menyimpan naskah asli Proklamasi.",
      },
      {
        id: 4,
        position: [0.8, -1.05, 0], // Museum Dasar
        title: "Museum Sejarah Nasional",
        description: "Ruangan besar berlapis marmer di dasar monumen yang memiliki 51 diorama sejarah Indonesia.",
      },
    ],
  },

  {
    // ========================================================
    // 2. CANDI PRAMBANAN
    // ========================================================
    id: "candi-prambanan",
    name: "Candi Prambanan",
    modelUri: model("candi_prambanan.glb"),
    latitude: -7.852222,
    longitude: 110.491667,
    mapScale: scaled(1.8),
    
    // SAMA PERSIS DENGAN MONAS
    popupScale: popup(20), 
    
    zIndex: 0,
    island: "Jawa",
    environmentPreset: "forest", 
    streetViewUrl: "https://goo.gl/maps/7QJjXZ8Z8Z8Z8Z8Z8", 
    description: "Candi utama (Induk) dalam kompleks Prambanan yang didedikasikan untuk Dewa Siwa (Mahadewa). Bangunan ini menjulang setinggi 47 meter.",
    
    // Posisi Annotation saya reset ke tengah agar mudah Anda atur ulang
    annotations: [
      { 
        id: 1, 
        position: [0, 0.42, -0.001], // Coba geser Y (tinggi) naik/turun
        title: "Puncak (Ratna)", 
        description: "Bagian atap berbentuk 'Ratna' (permata) yang melambangkan alam para Dewa. Berbeda dengan stupa pada candi Buddha, Ratna adalah ciri khas candi Hindu beraliran Siwa." 
      },
      { 
        id: 2, 
        position: [0, -0.2, 0.32], // Coba geser Z (maju/mundur)
        title: "Pintu Masuk", 
        description: "Bilik utama yang menghadap ke timur. Di dalamnya bersemayam arca Siwa Mahadewa setinggi 3 meter yang berdiri di atas Yoni berbentuk teratai." 
      },
      { 
        id: 3, 
        position: [0.35, -0.25, 0], // Coba geser X (kiri/kanan)
        title: "Relief", 
        description: "Ukiran cerita Ramayana." 
      },
    ],
  },

  {
    // ========================================================
    // 3. CANDI BOROBUDUR
    // ========================================================
    id: "borobudur",
    name: "Candi Borobudur",
    modelUri: model("borobudur.glb"),
    latitude: -7.607874,
    longitude: 110.203751,
    mapScale: scaled(0.09),
    popupScale: popup(1.4),
    zIndex: 0,
    island: "Jawa",
    environmentPreset: "forest",
    streetViewUrl: "https://www.google.com/maps/embed?pb=!4v1764686077281!6m8!1m7!1sArYnALlhMQ_Ni2Cf37_P3Q!2m2!1d-7.607994190665645!2d110.2043583718553!3f306.5484412804959!4f11.912834236912119!5f0.4000000000000002",
    description: "Candi Buddha terbesar di dunia yang terletak di Magelang.",
    annotations: [
      { id: 1, position: [0, 1.5, 0], title: "Stupa Induk", description: "Puncak tertinggi." },
      { id: 2, position: [0.5, 0.5, 0.5], title: "Stupa Berlubang", description: "72 stupa berisi arca Buddha." },
    ],
  },

  {
    // ========================================================
    // 4. MONUMEN KAPSUL WAKTU
    // ========================================================
    id: "monumen-kapsul-waktu",
    name: "Monumen Kapsul Waktu",
    modelUri: model("monumen_kapsul_waktu.glb"),
    latitude: -8.51,
    longitude: 140.355,
    mapScale: scaled(0.4),
    popupScale: popup(2.5),
    zIndex: 0,
    island: "Papua",
    environmentPreset: "park",
    streetViewUrl: "https://www.google.com/maps/embed?pb=!4v1764686350283!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ2t5dlB6aWdF!2m2!1d-8.508270479738403!2d140.4119933748439!3f275.73574163937036!4f0.3770285621036038!5f0.7820865974627469",
    description: "Monumen impian Indonesia 2085 di Merauke.",
    annotations: [
      { id: 1, position: [0, 1, 0], title: "Logo Avengers", description: "Desain arsitektur unik." },
      { id: 2, position: [0, 0.2, 0], title: "Kapsul Mimpi", description: "Menyimpan harapan anak bangsa." },
    ],
  },

  {
    // ========================================================
    // 5. TUGU KHATULISTIWA
    // ========================================================
    id: "tugu-katulistiwa",
    name: "Tugu Katulistiwa",
    modelUri: model("tugu_katulistiwa_3d.glb"),
    latitude: 0.02618,
    longitude: 109.3425,
    mapScale: scaled(0.4),
    popupScale: popup(4),
    zIndex: 0,
    island: "Kalimantan",
    environmentPreset: "city",
    streetViewUrl: "https://www.google.com/maps/embed?pb=!4v1764686531579!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ2ttSXY1YUE.!2m2!1d0.0009994971359691877!2d109.3222051828273!3f44.92688624897781!4f12.438324908050475!5f0.7820865974627469",
    description: "Titik nol derajat garis lintang bumi di Pontianak.",
    annotations: [
      { id: 1, position: [0, 1.5, 0], title: "Panah Arah", description: "Penunjuk Utara-Selatan." },
      { id: 2, position: [0, 0.2, 0], title: "Tonggak Asli", description: "Kayu asli tahun 1928." },
    ],
  },

  {
    // ========================================================
    // 6. PATUNG SUROBOYO
    // ========================================================
    id: "patung-suroboyo",
    name: "Patung Suroboyo",
    modelUri: model("patungsuroboyo.glb"),
    latitude: -7.257472,
    longitude: 112.752088,
    mapScale: scaled(0.04),
    popupScale: popup(0.6),
    zIndex: 0,
    island: "Jawa",
    environmentPreset: "city",
    streetViewUrl: "https://www.google.com/maps/embed?pb=!4v1764686946158!6m8!1m7!1sU5KPl00P7fV-6Q9YrW_r8A!2m2!1d-7.295867571669762!2d112.7386262620106!3f157.7543!4f0!5f0.7820865974627469",
    description: "Ikon kota Surabaya melambangkan ikan Hiu dan Buaya.",
    annotations: [
      { id: 1, position: [0, 1, 0], title: "Sura", description: "Ikan Hiu." },
      { id: 2, position: [0.5, 0.2, 0], title: "Baya", description: "Buaya." },
    ],
  },

  {
    // ========================================================
    // 7. MUSEUM SMB II
    // ========================================================
    id: "museum-sultan-mahmud-badaruddin-ii",
    name: "Museum SMB II",
    modelUri: model("museum_sultan_mahmud_badaruddin_ii.glb"),
    latitude: -2.990934,
    longitude: 104.756371,
    mapScale: scaled(0.18),
    popupScale: popup(2),
    zIndex: 0,
    island: "Sumatra",
    environmentPreset: "city",
    streetViewUrl: "https://www.google.com/maps/embed?pb=!4v1764688713755!6m8!1m7!1sLJShIXEzYd-HTCu9OlqemA!2m2!1d-2.990254882698889!2d104.761591389016!3f246.54443196615483!4f-3.6402656926313455!5f0.7820865974627469",
    description: "Museum sejarah Palembang di tepi Sungai Musi.",
    annotations: [
      { id: 1, position: [0, 1, 0], title: "Atap Limas", description: "Arsitektur lokal." },
      { id: 2, position: [0, -0.5, 0.8], title: "Pintu Masuk", description: "Gerbang utama." },
    ],
  },

  {
    // ========================================================
    // 8. MASJID RAYA SUMBAR
    // ========================================================
    id: "masjid-raya-sumbar",
    name: "Masjid Raya Sumbar",
    modelUri: model("masjid_raya_sumatera_barat.glb"),
    latitude: -0.947083,
    longitude: 100.417181,
    mapScale: scaled(0.04),
    popupScale: popup(0.5),
    zIndex: 0,
    island: "Sumatra",
    environmentPreset: "city",
    streetViewUrl: "https://www.google.com/maps/embed?pb=!4v1764689018260!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzR5dkQ3eWdF!2m2!1d-0.9242290308970521!2d100.3624958761296!3f337.45135179437085!4f5.078482308203817!5f0.7820865974627469",
    description: "Masjid dengan arsitektur atap Gonjong khas Minangkabau.",
    annotations: [
      { id: 1, position: [0, 1.5, 0], title: "Gonjong", description: "Atap Minang." },
      { id: 2, position: [0, 0.2, 0], title: "Struktur", description: "Tahan gempa." },
    ],
  },

  {
    // ========================================================
    // 9. JAM GADANG
    // ========================================================
    id: "jam-gadang",
    name: "Jam Gadang",
    modelUri: model("jam_gadang.glb"),
    latitude: -0.3055,
    longitude: 100.3693,
    mapScale: scaled(0.2),
    popupScale: popup(2),
    zIndex: 0,
    island: "Sumatra",
    environmentPreset: "city",
    streetViewUrl: "https://www.google.com/maps/embed?pb=!4v1764687420785!6m8!1m7!1spOH5K4Qyiq-kMs_90A-0WQ!2m2!1d-0.3050031606353411!2d100.3696770920085!3f218.6719470613562!4f11.33067463501665!5f0.7820865974627469",
    description: "Ikon Bukittinggi dengan mesin jam langka hadiah Ratu Belanda.",
    annotations: [
      { id: 1, position: [0, 2.5, 0], title: "Angka IIII", description: "Penulisan unik." },
      { id: 2, position: [0, 3, 0], title: "Gonjong", description: "Atap menara." },
    ],
  },

  {
    // ========================================================
    // 10. CANDI BAHAL
    // ========================================================
    id: "candi-bahal",
    name: "Candi Bahal",
    modelUri: model("candi_bahal.glb"),
    latitude: 2.076944,
    longitude: 99.065278,
    mapScale: scaled(0.08),
    popupScale: popup(1.2),
    zIndex: 0,
    island: "Sumatra",
    environmentPreset: "forest",
    streetViewUrl: "https://www.google.com/maps/embed?pb=!4v1764687521477!6m8!1m7!1sCAoSHENJQUJJaEFHYndQVGxoQXZNMmUtaWk0QUJsU2o.!2m2!1d1.409282310499514!2d99.72667830943367!3f165.52861!4f0!5f0.7820865974627469",
    description: "Candi bata merah peninggalan Kerajaan Pannai.",
    annotations: [
      { id: 1, position: [0, 1, 0], title: "Bata Merah", description: "Material utama." },
      { id: 2, position: [0, 0.2, 0.5], title: "Bilik", description: "Ruang pemujaan." },
    ],
  },
];

export const landmarks = baseLandmarks.map((landmark, index) => ({
  ...landmark,
  displayIndex: index + 1,
}));