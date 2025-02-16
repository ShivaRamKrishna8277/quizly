import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, get, push } from "firebase/database";
import { database as db } from "../../../../backend/firebase";
import Navbar from "./Navbar";
import QuizQuestion from "./QuizQuestion";
import Results from "./Results";

const Quiz = () => {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeTaken, setTimeTaken] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const quizRef = ref(db, `quizzes/${quizId}`);
        const snapshot = await get(quizRef);
        if (snapshot.exists()) {
          setQuizData(snapshot.val());
          setTimeLeft(snapshot.val().timeLimit * 60);
        } else {
          setError("Quiz not found");
        }
      } catch (err) {
        setError("Failed to load quiz data");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId]);

  // Timer Logic
  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 && quizStarted) {
      setQuizCompleted(true);
    }
  }, [quizStarted, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const handleStartQuiz = () => {
    if (!name || !mobile) {
      setErrorMessage("Please enter your Name and Mobile Number!");
      return;
    }
    setStartTime(Date.now());
    setQuizStarted(true);
    setErrorMessage(""); // Clear error on valid input
  };

  const handleSelectAnswer = (questionIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const finalTimeTaken = quizData.timeLimit * 60 - timeLeft; // Time taken in seconds
      setTimeTaken(formatTime(finalTimeTaken)); // Format to mm:ss

      // Calculate score
      const score = Object.keys(selectedAnswers).reduce(
        (acc, index) =>
          quizData.questions[index].correctOption === selectedAnswers[index]
            ? acc + 1
            : acc,
        0
      );

      // Save to Firebase leaderboard
      const leaderboardRef = ref(db, `leaderboards/${quizId}`);
      push(leaderboardRef, {
        name,
        mobile,
        score,
        timeTaken: formatTime(finalTimeTaken),
        timestamp: Date.now(),
      });

      setQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <p className="text-center text-gray-500">Loading quiz...</p>
      </div>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <Navbar title="Start the Quiz" />
      {quizCompleted ? (
        <Results
          score={Object.keys(selectedAnswers).reduce(
            (score, index) =>
              quizData.questions[index].correctOption === selectedAnswers[index]
                ? score + 1
                : score,
            0
          )}
          totalQuestions={quizData.questions.length}
          timeTaken={timeTaken}
          quizId={quizId} // Pass quizId to Results
        />
      ) : quizStarted ? (
        <div className="p-6">
          <div className="text-right text-gray-500 mb-4">
            Time Left: {formatTime(timeLeft)}
          </div>
          <QuizQuestion
            question={quizData.questions[currentQuestionIndex]}
            index={currentQuestionIndex}
            totalQuestions={quizData.questions.length}
            onSelectAnswer={handleSelectAnswer}
            selectedAnswer={selectedAnswers[currentQuestionIndex]}
          />
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousQuestion}
              className={`px-4 py-2 rounded-lg font-semibold ${
                currentQuestionIndex === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              }`}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg"
            >
              {currentQuestionIndex === quizData.questions.length - 1
                ? "End Quiz"
                : "Next"}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">{quizData.title}</h2>
          <p className="text-gray-600 mb-4">
            Time Limit: {quizData.timeLimit} minutes
          </p>
          <input
            type="text"
            placeholder="Enter Name"
            className="border p-2 rounded mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          /> <br/>
          <input
            type="text"
            placeholder="Enter Mobile Number"
            className="border p-2 rounded mb-4"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          /> <br />
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <button
            onClick={handleStartQuiz}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg"
          >
            Start Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
