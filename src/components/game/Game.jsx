import { useState, useEffect, useMemo, useCallback } from "react";
import { landmarks } from "../../data/landmarks";

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random landmarks excluding the correct one and used landmarks
 * Always returns the requested count of options
 */
function getRandomOptions(correctLandmark, allLandmarks, usedIds, count = 3) {
  // First try: get options excluding used landmarks
  let others = allLandmarks.filter(
    (l) => l.id !== correctLandmark.id && !usedIds.has(l.id)
  );
  
  // If not enough options available (all used), get any landmarks except correct
  if (others.length < count) {
    others = allLandmarks.filter(
      (l) => l.id !== correctLandmark.id
    );
  }
  
  const shuffled = shuffleArray(others);
  // Ensure we always return exactly count options
  return shuffled.slice(0, count).length === count 
    ? shuffled.slice(0, count)
    : shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Game Component
 * A guessing game where users identify Indonesian landmarks from street view images
 */
function Game({ onBack }) {
  // Filter landmarks that have street view
  const validLandmarks = useMemo(
    () =>
      landmarks.filter(
        (l) =>
          l.streetViewUrl &&
          !String(l.streetViewUrl).includes("undefined")
      ),
    []
  );

  const [currentLandmark, setCurrentLandmark] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [, setUsedLandmarkIds] = useState(new Set());

  // Start a new round
  const startNewRound = useCallback(() => {
    if (validLandmarks.length < 4) {
      console.warn("Not enough landmarks");
      return;
    }

    setUsedLandmarkIds((prevUsedIds) => {
      let availableLandmarks = validLandmarks.filter(
        (l) => !prevUsedIds.has(l.id)
      );

      // If all used, reset for new game
      if (availableLandmarks.length === 0) {
        prevUsedIds = new Set();
        availableLandmarks = validLandmarks;
      }

      // Pick random landmark as the correct answer
      const randomIndex = Math.floor(Math.random() * availableLandmarks.length);
      const correct = availableLandmarks[randomIndex];

      // Get 3 wrong options (always tries to get 3, even if reusing)
      const wrongOptions = getRandomOptions(
        correct,
        validLandmarks,
        prevUsedIds,
        3
      );

      // Combine and shuffle all options (ensure exactly 4 options)
      const allOptions = shuffleArray([correct, ...wrongOptions]);
      
      // Safety check: ensure we have exactly 4 options
      if (allOptions.length !== 4) {
        console.warn(`Expected 4 options, got ${allOptions.length}`);
      }

      setCurrentLandmark(correct);
      setOptions(allOptions);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowResult(false);

      // Return new Set with added landmark
      return new Set(prevUsedIds).add(correct.id);
    });
  }, [validLandmarks]);

  // Handle answer selection
  const handleSelectAnswer = (landmark) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(landmark.id);
    const correct = landmark.id === currentLandmark.id;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  // Handle next round
  const handleNextRound = () => {
    if (round >= totalRounds) {
      setGameOver(true);
    } else {
      setRound((prev) => prev + 1);
      startNewRound();
    }
  };

  // Handle restart game
  const handleRestartGame = () => {
    setScore(0);
    setRound(1);
    setGameOver(false);
    startNewRound();
  };

  // Initialize game only once
  useEffect(() => {
    if (!currentLandmark) {
      startNewRound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentLandmark) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 flex items-center justify-center">
        <div className="text-cyan-soft text-xl">Game Loading...</div>
      </div>
    );
  }

  // Game Over Screen
  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center border border-teal-light/30 shadow-2xl">
          <h1 className="text-4xl font-bold text-cyan-soft mb-4">Game Over!</h1>
          <div className="text-6xl font-bold text-teal-light mb-6">
            {score}/{totalRounds}
          </div>
          <p className="text-cyan-soft/80 mb-8">
            {score === totalRounds}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRestartGame}
              className="w-full py-3 px-6 bg-teal-primary hover:bg-teal-600 text-white rounded-xl font-semibold transition-all hover:scale-105"
            >
              Main Lagi
            </button>
            <button
              onClick={onBack}
              className="w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 text-cyan-soft rounded-xl font-semibold transition-all hover:scale-105"
            >
              Kembali ke Peta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-sm border-b border-teal-light/20">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cyan-soft hover:text-teal-light transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Kembali ke Peta
        </button>
        <h1 className="text-xl font-bold text-cyan-soft">
          Landmark Game
        </h1>
        <div className="flex items-center gap-4 text-cyan-soft">
          <span className="bg-teal-primary/30 px-3 py-1 rounded-full">
            Round {round}/{totalRounds}
          </span>
          <span className="bg-green-600/30 px-3 py-1 rounded-full">
            Score: {score}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
        {/* Street View */}
        <div className="flex-1 relative rounded-2xl overflow-hidden border border-teal-light/30 shadow-xl min-h-[300px] lg:min-h-0 bg-slate-900">
          {currentLandmark.streetViewUrl ? (
            <iframe
              src={currentLandmark.streetViewUrl}
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cyan-soft text-center p-4">
              <div>
                <p className="text-lg font-semibold mb-2">Street View tidak tersedia</p>
              </div>
            </div>
          )}
        </div>

        {/* Options Panel */}
        <div className="lg:w-96 bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-teal-light/20">
          <h2 className="text-xl font-semibold text-cyan-soft mb-4 text-center">
            Apa nama dari objek ini?
          </h2>
          <div className="space-y-3">
            {options.map((landmark) => {
              const isSelected = selectedAnswer === landmark.id;
              const isCorrectAnswer = landmark.id === currentLandmark.id;

              let buttonClass =
                "w-full p-4 rounded-xl text-left font-medium transition-all ";

              if (showResult) {
                if (isCorrectAnswer) {
                  buttonClass +=
                    "bg-green-600/80 text-white border-2 border-green-400";
                } else if (isSelected && !isCorrectAnswer) {
                  buttonClass +=
                    "bg-red-600/80 text-white border-2 border-red-400";
                } else {
                  buttonClass +=
                    "bg-slate-700/50 text-cyan-soft/50 border border-slate-600";
                }
              } else {
                buttonClass +=
                  "bg-slate-700/80 hover:bg-teal-primary/50 text-cyan-soft border border-slate-600 hover:border-teal-light hover:scale-[1.02]";
              }

              return (
                <button
                  key={landmark.id}
                  onClick={() => handleSelectAnswer(landmark)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <span className="block truncate">{landmark.name}</span>
                  {showResult && isCorrectAnswer && (
                    <span className="text-sm opacity-80 block mt-1">
                      Jawaban Benar
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Result & Next Button */}
          {showResult && (
            <div className="mt-6 text-center">
              <div
                className={`text-lg font-bold mb-4 ${
                  isCorrect ? "text-green-400" : "text-red-400"
                }`}
              >
                {isCorrect ? "Benar!" : "Salah!"}
              </div>
              <p className="text-cyan-soft/80 text-sm mb-4">
                Jawabannya adalah <strong>{currentLandmark.name}</strong>
              </p>
              <button
                onClick={handleNextRound}
                className="w-full py-3 px-6 bg-teal-primary hover:bg-teal-600 text-white rounded-xl font-semibold transition-all hover:scale-105"
              >
                {round >= totalRounds ? "Lihat Hasil" : "Ronde Berikutnya →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Game;
