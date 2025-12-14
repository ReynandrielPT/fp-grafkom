import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { generateQuizSession } from "../../utils/quizGenerator";
import QuizCanvas from "./QuizCanvas"; 
import QuizOptions from "./QuizOptions"; 
import QuizResult from "./QuizResult"; 
import LoadingScreen from "../ui/LoadingScreen"; 

const QuizView = () => {
  const navigate = useNavigate();
  const [quizSession, setQuizSession] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);

  useEffect(() => {
    const session = generateQuizSession(5); // buat generate 5 soal
    if (session.length > 0) {
      setQuizSession(session);
      setIsLoadingQuiz(false);
    } else {
      // kalo misal ada error misal landmarks kurang
      console.error("Failed to generate quiz session.");
      navigate("/"); // redirect
    }
  }, [navigate]);

  const handleAnswerSelect = useCallback((selectedAnswer) => {
    const currentQuestion = quizSession[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < quizSession.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setIsQuizFinished(true);
    }
  }, [quizSession, currentQuestionIndex]);

  const resetQuiz = useCallback(() => {
    const session = generateQuizSession(5);
    if (session.length > 0) {
      setQuizSession(session);
      setCurrentQuestionIndex(0);
      setScore(0);
      setIsQuizFinished(false);
    } else {
      console.error("Failed to regenerate quiz session.");
      navigate("/");
    }
  }, [navigate]);

  if (isLoadingQuiz) {
    return <LoadingScreen progress={0} isComplete={false} />;
  }

  if (isQuizFinished) {
    return (
      <QuizResult
        score={score}
        totalQuestions={quizSession.length}
        onPlayAgain={resetQuiz}
        onReturnToMap={() => navigate("/")}
      />
    );
  }

  const currentQuestion = quizSession[currentQuestionIndex];

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-end items-center bg-gray-900">
      <div className="absolute inset-0">
        <QuizCanvas modelUri={currentQuestion.modelUri} />
      </div>

      <div className="relative z-10 w-full p-4 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent">
        <h2 className="text-xl text-white text-center mb-4">
          Apa nama landmark ini? ({currentQuestionIndex + 1}/{quizSession.length})
        </h2>
        <QuizOptions
          options={currentQuestion.options}
          onAnswerSelect={handleAnswerSelect}
        />
      </div>
    </div>
  );
};

export default QuizView;
