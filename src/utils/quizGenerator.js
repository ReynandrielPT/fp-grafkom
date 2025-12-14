import { landmarks } from '../data/landmarks';

// fungsi helper buat nge-shuffle array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/**
 * Generates a quiz session with a specified number of questions.
 * Each question presents a 3D model path and a set of multiple-choice options,
 * including the correct answer and three random incorrect answers.
 * @param {number} numberOfQuestions The number of questions to generate for the quiz.
 * @returns {Array<Object>} An array of quiz question objects.
 */
export const generateQuizSession = (numberOfQuestions = 5) => {
  if (!landmarks || landmarks.length < 4) {
    console.error("Not enough landmarks to generate a quiz.");
    return [];
  }

  const quizQuestions = [];
  const allLandmarkNames = landmarks.map(lm => lm.name);
  const availableLandmarks = [...landmarks]; // buat salinan yang bisa diubah

  // ensure kita nga bikin soal lebih banyak dari jumlah landmark yang ada
  const actualNumberOfQuestions = Math.min(numberOfQuestions, availableLandmarks.length);

  for (let i = 0; i < actualNumberOfQuestions; i++) {
    // pilih landmark acak buat pertanyaan saat ini
    const randomIndex = Math.floor(Math.random() * availableLandmarks.length);
    const correctAnswerLandmark = availableLandmarks[randomIndex];

    // Hapus landmark yang dipilih dari opsi yang tersedia untuk pertanyaan berikutnya
    availableLandmarks.splice(randomIndex, 1);

    const correctAnswer = correctAnswerLandmark.name;
    const modelUri = correctAnswerLandmark.modelUri; 

    // buat opsi salah
    const incorrectOptions = [];
    const potentialIncorrects = allLandmarkNames.filter(name => name !== correctAnswer);

    // shuffle dan ambil 3 opsi salah
    shuffleArray(potentialIncorrects);
    for (let k = 0; k < 3 && k < potentialIncorrects.length; k++) {
      incorrectOptions.push(potentialIncorrects[k]);
    }

    // gabungkan semua opsi dan shuffle
    const allOptions = shuffleArray([correctAnswer, ...incorrectOptions]);

    quizQuestions.push({
      modelUri,
      correctAnswer,
      options: allOptions,
    });
  }

  return quizQuestions;
};
