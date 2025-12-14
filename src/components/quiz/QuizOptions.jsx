import React from "react";
// ini ui opsi jawaban kuis
const QuizOptions = ({ options, onAnswerSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mx-auto">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onAnswerSelect(option)}
          className="bg-teal-primary/30 hover:bg-teal-primary/50 text-cyan-soft border border-teal-light/30 px-6 py-3 rounded-xl backdrop-blur-xl transition-all hover:scale-105 shadow-lg text-lg font-semibold"
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default QuizOptions;
