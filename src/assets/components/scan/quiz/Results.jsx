import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database as db } from "../../../../backend/firebase";

const Results = ({ score, totalQuestions, timeTaken, quizId }) => {
  const [leaderboard, setLeaderboard] = useState([]);

  // Helper function to convert "00:04" to seconds (e.g., 4)
  const convertTimeToSeconds = (timeString) => {
    const [minutes, seconds] = timeString.split(":").map(Number);
    return minutes * 60 + seconds;
  };

  const fetchLeaderboard = async () => {
    const leaderboardRef = ref(db, `leaderboards/${quizId}`);
    const snapshot = await get(leaderboardRef);

    if (snapshot.exists()) {
      const rawData = snapshot.val();

      // Debugging: Log the raw data from Firebase
      console.log("Raw data from Firebase:", rawData);

      // Convert the raw data into an array of entries
      const data = Object.values(rawData);

      // Debugging: Log the data before sorting
      console.log("Data before sorting:", data);

      // Sort the data
      const sortedData = data.sort((a, b) => {
        const scoreA = Number(a.score) || 0; // Ensure score is a number
        const scoreB = Number(b.score) || 0; // Ensure score is a number
        const timeA = convertTimeToSeconds(a.timeTaken); // Convert "00:04" to seconds
        const timeB = convertTimeToSeconds(b.timeTaken); // Convert "00:04" to seconds

        // Debugging: Log the values being compared
        console.log(
          `Comparing: ${scoreA} (${timeA}s) vs ${scoreB} (${timeB}s)`
        );

        if (scoreB === scoreA) {
          return timeA - timeB; // Lower time is better
        }
        return scoreB - scoreA; // Higher score is better
      });

      // Debugging: Log the sorted data
      console.log("Sorted data:", sortedData);

      setLeaderboard(sortedData);
    } else {
      console.log("No leaderboard data found for quizId:", quizId);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [quizId]);

  const incorrectAnswers = totalQuestions - score;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Results</h2>

      <div className="bg-blue-100 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700">
          Your Score:{" "}
          <span className="text-blue-600">
            {score}/{totalQuestions}
          </span>
        </h3>
        <p className="text-gray-600 mt-4">
          ✅ Correct Answers:{" "}
          <span className="text-green-600 font-bold">{score}</span>
        </p>
        <p className="text-gray-600">
          ❌ Incorrect Answers:{" "}
          <span className="text-red-600 font-bold">{incorrectAnswers}</span>
        </p>
        <p className="text-gray-600 mt-4">
          ⏳ Time Taken: <span className="font-semibold">{timeTaken} s</span>
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mt-6">Leaderboard</h2>
      <div className="bg-gray-100 p-4 pb-2 rounded-lg mt-2">
        <button
          onClick={() => fetchLeaderboard()}
          className="w-fit bg-white p-2 rounded text-[10px] font-medium mb-3"
        >
          Refresh Leaderboard
        </button>
        {leaderboard.length > 0 ? (
          <ul className="text-gray-700">
            {leaderboard.map((entry, index) => (
              <li
                key={index}
                className={`p-2 px-4 rounded-lg mb-2 ${
                  index === 0 ? "bg-yellow-300 font-bold" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-[50%] text-start line-clamp-1">
                    {index + 1}. {entry.name}
                  </span>
                  <span>{entry.score} pts</span>
                  <span>{entry.timeTaken} s</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No leaderboard data available.</p>
        )}
      </div>
    </div>
  );
};

export default Results;
