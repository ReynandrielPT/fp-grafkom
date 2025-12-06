import { resolveAssetPath } from "../utils/assets";
import { LANDMARK } from "../config/mapConfig";

/**
 * Helper functions for landmark data
 */
const model = (file) => resolveAssetPath(`model/${file}`);
const scaled = (multiplier = 1) => LANDMARK.DEFAULT_SCALE * multiplier;

const baseLandmarks = [
  {
    // 1
    id: "monas-jakarta",
    name: "Monumen Nasional (Monas)",
    modelUri: model("monas.glb"),
    latitude: -6.175392,
    longitude: 106.827153,
    scale: scaled(1.8),
    zIndex: 0,
    description:
      "Monumen Nasional yang disingkat dengan Monas atau Tugu Monas adalah monumen peringatan setinggi 132 meter, terletak tepat di tengah Lapangan Medan Merdeka, Jakarta Pusat. Monas didirikan untuk mengenang perlawanan dan perjuangan rakyat Indonesia dalam merebut kemerdekaan dari pemerintahan kolonial Kerajaan Belanda. Pembangunan dimulai pada 17 Agustus 1961 di bawah perintah Presiden Soekarno dan diresmikan hingga dibuka untuk umum pada 12 Juli 1975 oleh Presiden Soeharto. Tugu ini dimahkotai lidah api yang dilapisi lembaran emas yang melambangkan semangat perjuangan dari rakyat Indonesia.",
    //wikiDescriptionUrl: "https://id.wikipedia.org/api/rest_v1/page/summary/Monumen_Nasional", // extract contains the summary
    island: "Jawa",
    streetViewUrl:
      "https://www.google.com/maps/embed?pb=!4v1764683815646!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJREUzclhOWEE.!2m2!1d-6.175035830309233!2d106.8271922828707!3f269.17352!4f0!5f0.7820865974627469",
  },
  {
    // 2
    id: "candi-prambanan",
    name: "Candi Prambanan",
    modelUri: model("candi_prambanan.glb"),
    latitude: -7.852222,
    longitude: 110.491667,
    scale: scaled(6),
    zIndex: 0,
    description:
      "Candi Prambanan adalah bangunan candi bercorak agama Hindu terbesar di Indonesia yang dibangun pada abad ke-9 Masehi. Candi yang juga disebut sebagai Rara Jonggrang ini dipersembahkan untuk Trimurti, tiga dewa utama Hindu yaitu dewa Brahma sebagai dewa pencipta, dewa Wisnu sebagai dewa pemelihara, dan dewa Siwa sebagai dewa pemusnah. Berdasarkan prasasti Siwagrha nama asli kompleks candi ini adalah Siwagrha, dan memang di garbagriha candi ini bersemayam arca Siwa Mahadewa setinggi tiga meter, karena aliran Syaiwa mengutamakan pemujaan dewa Siwa di candi ini.",

    island: "Jawa",
    streetViewUrl:
      "https://www.google.com/maps/embed?pb=!4v1764685566710!6m8!1m7!1szoywrhCLZWVhuEQb0wwRkg!2m2!1d-7.752211992764268!2d110.4921424240987!3f259.0937385099725!4f-5.50280768510838!5f0.4000000000000002",
    /*additionalContent: {
      title: "Sejarah Singkat",
      paragraphs: [
        "Candi Prambanan adalah kompleks candi Hindu dari abad ke-9 yang terletak di Jawa Tengah. Dibangun sebagai penghormatan kepada Trimurti (Siwa, Wisnu, dan Brahma), Prambanan terkenal karena arsitekturnya yang tinggi dan relief yang kaya.",
        "Kompleks ini sempat mengalami kerusakan dan pemugaran, tetapi tetap menjadi situs warisan penting dan tujuan wisata budaya.",
      ],
    },*/
  },
  {
    // 3
    id: "borobudur",
    name: "Candi Borobudur",
    modelUri: model("borobudur.glb"),
    latitude: -7.607874,
    longitude: 110.203751,
    // Make Borobudur appear smaller in map pop/animation
    scale: scaled(0.09),
    zIndex: 0,
    description:
      "Candi Borobudur adalah sebuah candi Buddha yang terletak di Borobudur, Magelang, Jawa Tengah, Indonesia. Candi ini terletak kurang lebih 100 km di sebelah barat daya Semarang, 86 km di sebelah barat Surakarta, dan 40 km di sebelah barat laut Yogyakarta. Candi dengan banyak stupa ini didirikan oleh para penganut agama Buddha Mahayana sekitar tahun 800-an Masehi pada masa pemerintahan wangsa Syailendra. Borobudur adalah candi atau kuil Buddha terbesar di dunia, sekaligus salah satu monumen Buddha terbesar di dunia.",
    island: "Jawa",
    streetViewUrl:
      "https://www.google.com/maps/embed?pb=!4v1764686077281!6m8!1m7!1sArYnALlhMQ_Ni2Cf37_P3Q!2m2!1d-7.607994190665645!2d110.2043583718553!3f306.5484412804959!4f11.912834236912119!5f0.4000000000000002",
  },
  {
    // 4
    id: "monumen-kapsul-waktu",
    name: "Monumen Kapsul Waktu",
    modelUri: model("monumen_kapsul_waktu.glb"),
    // location: Merauke, Papua
    latitude: -8.51,
    longitude: 140.355,
    scale: scaled(0.4),
    zIndex: 0,
    description:
      "Monumen Kapsul Waktu Merauke adalah sebuah monumen yang terletak di Merauke, Papua Selatan. Monumen ini dibangun diatas lahan seluas 2,5 hektar (ha) dan menjadi ikon baru di Indonesia Timur. Monumen Kapsul Waktu berisikan impian anak-anak Indonesia dari Sabang sampai Merauke, dan nantinya akan dibuka kembali 70 tahun berikutnya atau tahun 2085. Kapsul waktu tersebut dibawa secara estafet mulai dari Aceh ke seluruh provinsi dan berakhir di Kabupaten Merauke, Provinsi Papua Selatan. Ide pembangunan kapsul waktu berasal dari Presiden Joko Widodo pada HUT ke-70 Kemerdekaan Indonesia tahun 2015.",
    island: "Papua",
    streetViewUrl:
      "https://www.google.com/maps/embed?pb=!4v1764686350283!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ2t5dlB6aWdF!2m2!1d-8.508270479738403!2d140.4119933748439!3f275.73574163937036!4f0.3770285621036038!5f0.7820865974627469",
  },
  {
    // 5
    id: "tugu-katulistiwa",
    name: "Tugu Katulistiwa (Equator Monument)",
    modelUri: model("tugu_katulistiwa_3d.glb"),
    latitude: 0.02618,
    longitude: 109.3425,
    scale: scaled(0.4),
    zIndex: 0,
    description:
      "Tugu Khatulistiwa atau dalam bahasa Inggris : Equator Monument, adalah sebuah bangunan yang berfungsi sebagai penanda area atau titik yang dilewati garis khatulistiwa. Tugu ini juga merupakan salah satu tempat bersejarah yang terdapat di Kalimantan Barat, serta menjadi objek wisata di Kota Pontianak. Selain sebagai tempat wisata, tugu ini berfungsi sebagai sumber pembelajaran karena merupakan lokasi penelitian astronomi dan juga untuk wisata edukasi.",
    island: "Kalimantan",
    streetViewUrl:
      "https://www.google.com/maps/embed?pb=!4v1764686531579!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ2ttSXY1YUE.!2m2!1d0.0009994971359691877!2d109.3222051828273!3f44.92688624897781!4f12.438324908050475!5f0.7820865974627469",
  },
  {
    // 6
    id: "patung-suroboyo",
    name: "Patung Suroboyo",
    modelUri: model("patungsuroboyo.glb"),
    latitude: -7.257472,
    longitude: 112.752088,
    scale: scaled(0.04),
    zIndex: 0,
    description:
      "Patung Sura dan Baya adalah ikon paling terkenal dan juga pemandu Kota Surabaya dan Madura. Patung tersebut terdiri dari dua jenis binatang, hiu dan buaya. Patung ini terdapat di tiga tempat di Kota Surabaya dan juga satu di Korea Selatan.",
    island: "Jawa",
    streetViewUrl:
      "https://www.google.com/maps/embed?pb=!4v1764686946158!6m8!1m7!1sU5KPl00P7fV-6Q9YrW_r8A!2m2!1d-7.295867571669762!2d112.7386262620106!3f157.7543!4f0!5f0.7820865974627469",
  },
  {
    // 7
    id: "museum-sultan-mahmud-badaruddin-ii",
    name: "Museum Sultan Mahmud Badaruddin II",
    modelUri: model("museum_sultan_mahmud_badaruddin_ii.glb"),
    latitude: -2.990934,
    longitude: 104.756371,
    scale: scaled(0.18),
    zIndex: 0,
    description:
      "Museum Sultan Mahmud Badaruddin II adalah museum di kota Palembang, Sumatera Selatan, Indonesia. Museum ini didirikan di bekas bangunan rumah residen kolonial Sumatera Selatan abad ke-19. Bangunan ini juga menjadi gedung dinas pariwisata Palembang.",
    island: "Sumatra",
    streetViewUrl:
      "https://www.google.com/maps/embed?pb=!4v1764688713755!6m8!1m7!1sLJShIXEzYd-HTCu9OlqemA!2m2!1d-2.990254882698889!2d104.761591389016!3f246.54443196615483!4f-3.6402656926313455!5f0.7820865974627469",
  },
  {
    // 8
    id: "masjid-raya-sumbar",
    name: "Masjid Raya Sumatera Barat",
    modelUri: model("masjid_raya_sumatera_barat.glb"),
    latitude: -0.947083,
    longitude: 100.417181,
    scale: scaled(0.04),
    zIndex: 0,
    description:
      "Masjid Raya Sumatera Barat atau Masjid Raya Syekh Ahmad Khatib Al Minangkabawi terletak di Jalan Chatib Sulaiman, Kota Padang, Sumatera Barat. Pembangunannya diawali peletakan batu pertama pada 21 Desember 2007 dan dinyatakan selesai pada 4 Januari 2019 dengan total biaya sekitar Rp330 miliar. Masjid ini didesain oleh Rizal Muslimin lewat proses sayembara yang diadakan pemerintah daerah pada 2006. Adapun rancang bangun rinci dikerjakan oleh Penta Rekayasa. Total Bangun Persada bertindak sebagai kontraktor pelaksana untuk lima tahap awal pembangunan.",
    island: "Sumatra",
    streetViewUrl:
      "https://www.google.com/maps/embed?pb=!4v1764689018260!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzR5dkQ3eWdF!2m2!1d-0.9242290308970521!2d100.3624958761296!3f337.45135179437085!4f5.078482308203817!5f0.7820865974627469",
  },
  {
    // 9
    id: "jam-gadang",
    name: "Jam Gadang",
    modelUri: model("jam_gadang.glb"),
    latitude: -0.3055,
    longitude: 100.3693,
    scale: scaled(0.2),
    zIndex: 0,
    description:
      'Jam Gadang adalah menara jam setinggi 27 meter yang menjadi penanda atau ikon Kota Bukittinggi, Sumatera Barat, Indonesia. Terdapat jam berukuran besar berdiameter 80 cm di empat sisi menara sehingga dinamakan Jam Gadang, sebutan bahasa Minangkabau yang berarti "jam besar".',
    island: "Sumatra",
    streetViewUrl:
      "https://www.google.com/maps/embed?pb=!4v1764687420785!6m8!1m7!1spOH5K4Qyiq-kMs_90A-0WQ!2m2!1d-0.3050031606353411!2d100.3696770920085!3f218.6719470613562!4f11.33067463501665!5f0.7820865974627469",
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
      "Candi Bahal, Biaro Bahal, atau Candi Portibi adalah kompleks candi Buddha aliran Vajrayana yang terletak di Desa Bahal, Kecamatan Padang Bolak, Portibi, Kabupaten Padang Lawas Utara, Sumatera Utara, sekitar 3 jam perjalanan dari Kota Padang Sidempuan atau berjarak sekitar 400 km dari Kota Medan. Candi ini terbuat dari bahan bata merah dan diduga berasal dari sekitar abad ke-11 dan dikaitkan dengan Kerajaan Pannai, salah satu pelabuhan di pesisir Selat Malaka yang ditaklukan dan menjadi bagian dari mandala Sriwijaya. Memiliki tiga bangunan kuno yaitu Biaro Bahal I, II dan III. Saling berhubungan dan terdiri dalam satu garis yang lurus.",
    island: "Sumatra",
    streetViewUrl:
      "https://www.google.com/maps/embed?pb=!4v1764687521477!6m8!1m7!1sCAoSHENJQUJJaEFHYndQVGxoQXZNMmUtaWk0QUJsU2o.!2m2!1d1.409282310499514!2d99.72667830943367!3f165.52861!4f0!5f0.7820865974627469",
  },
  // kayaknya bagian dari prambanan, ga ada di wiki/google maps (adanya di lokasi dekat prambanan)
  // {
  //   id: "candi-apit",
  //   name: "Candi Apit",
  //   modelUri: model("candi_apit.glb"),
  //   latitude: -0.503333,
  //   longitude: 101.41,
  //   scale: scaled(0.4),
  //   zIndex: 0,
  //   description:
  //     "Candi Apit is a historic temple site of local significance, representing Indonesia's rich archaeological and cultural landscape.",
  //   island: "Sumatra",
  //   streetViewUrl: "https://www.google.com/maps/embed?pb=!4v1764335554591!6m8!1m7!1sDgvKbYXg0MEOxB4gWP73Sg!2m2!1d-7.307277722493254!2d112.7800860605329!3f168.73106!4f0!5f0.7820865974627469",
  // },
];

export const landmarks = baseLandmarks.map((landmark, index) => ({
  ...landmark,
  displayIndex: index + 1,
}));
