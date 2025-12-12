# Landmarks Directory

This directory contains individual landmark files for the Petanesia application.

## Structure

Each landmark is stored in its own file with the naming convention matching the landmark ID:
- `monas.js` - Monumen Nasional (Jakarta)
- `candi-prambanan.js` - Candi Prambanan
- `borobudur.js` - Candi Borobudur
- `monumen-kapsul-waktu.js` - Monumen Kapsul Waktu (Papua)
- `tugu-katulistiwa.js` - Tugu Katulistiwa (Kalimantan)
- `patung-suroboyo.js` - Patung Suroboyo (Surabaya)
- `museum-sultan-mahmud-badaruddin-ii.js` - Museum SMB II (Palembang)
- `masjid-raya-sumbar.js` - Masjid Raya Sumatera Barat
- `jam-gadang.js` - Jam Gadang (Bukittinggi)
- `candi-bahal.js` - Candi Bahal (Sumatra)

## File Format

Each landmark file exports a default object with the following structure:

```javascript
export default {
  id: "landmark-id",
  name: "Landmark Name",
  modelUri: model("filename.glb"),
  audioUri: audio("audio-file.mp3"),
  latitude: -6.175392,
  longitude: 106.827153,
  mapScale: scaled(1.8),
  popupScale: popup(20),
  zIndex: 0,
  island: "Island Name",
  environmentPreset: "park",
  streetViewUrl: "Google Maps embed URL",
  description: "Landmark description",
  annotations: [
    {
      id: 1,
      position: [x, y, z],
      title: "Annotation Title",
      description: "Annotation description"
    }
  ]
};
```

## Audio Support

Each landmark includes an `audioUri` field that points to an audio file that will be played when the landmark overlay is opened. The audio files should be placed in the `public/music/` directory.

## Adding New Landmarks

1. Create a new `.js` file in this directory with the landmark ID as the filename
2. Copy the structure from an existing landmark file
3. Fill in the landmark details
4. Add the audio file to `public/music/`
5. The `index.js` file will automatically import and include the new landmark

## Import

All landmarks are automatically imported via the `index.js` file which uses Vite's `import.meta.glob` to dynamically load all `.js` files in this directory.

The landmarks are then exported from `src/data/landmarks.js` for use throughout the application.
