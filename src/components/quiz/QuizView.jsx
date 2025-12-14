import React, { useState, useEffect, useCallback, Suspense } from "react";
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
  // isLoadingQuiz state is removed

  useEffect(() => {
    const session = generateQuizSession(5); // buat generate 5 soal
    if (session.length > 0) {
      setQuizSession(session);
      // No need to set loading to false here
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

  // This check is no longer needed, Suspense will handle it
  // if (isLoadingQuiz) { ... }

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

  // Handle case where quiz session is not yet generated
  if (quizSession.length === 0) {
    return <LoadingScreen progress={0} isComplete={false} />;
  }

  const currentQuestion = quizSession[currentQuestionIndex];

  return (
    <Suspense fallback={<LoadingScreen progress={0} isComplete={false} />}>
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
    </Suspense>
  );
};

export default QuizView;
