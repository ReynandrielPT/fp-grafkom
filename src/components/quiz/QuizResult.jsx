import React from "react";
// ini buat UI hasil kuis 
const QuizResult = ({ score, totalQuestions, onPlayAgain, onReturnToMap }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-br from-ocean-deep/95 via-ocean-dark/90 to-teal-primary/20 backdrop-blur-xl text-cyan-soft p-4">
      <h2 className="text-4xl font-bold mb-6">Kuis Selesai!</h2>
      <p className="text-2xl mb-8">
        Skor Anda: {score} dari {totalQuestions}
      </p>
      <div className="flex gap-4">
        <button
          onClick={onPlayAgain}
          className="bg-teal-primary/30 hover:bg-teal-primary/50 text-cyan-soft border border-teal-light/30 px-6 py-3 rounded-xl backdrop-blur-xl transition-all hover:scale-105 shadow-lg text-lg font-semibold"
        >
          Main Lagi
        </button>
        <button
          onClick={onReturnToMap}
          className="bg-gray-700/30 hover:bg-gray-700/50 text-gray-300 border border-gray-600/30 px-6 py-3 rounded-xl backdrop-blur-xl transition-all hover:scale-105 shadow-lg text-lg font-semibold"
        >
          Kembali ke Peta
        </button>
      </div>
    </div>
  );
};

export default QuizResult;
