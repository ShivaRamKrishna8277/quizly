import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./assets/components/landing/Landing";
import Scan from "./assets/components/scan/Scan";
import Create from "./assets/components/create/Create";
import QuizQR from "./assets/components/create/components/quizqr/QuizQR";
import Quiz from "./assets/components/scan/quiz/Quiz";

const App = () => {
  return (
    <Router>
      <div className="mainContentWrapper bg-black flex items-center justify-center h-screen">
        <div className="mainContent h-screen overflow-y-auto w-full max-w-[580px] bg-white">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/qr/:quizId" element={<QuizQR />} />
            <Route path="/quiz/:quizId" element={<Quiz />} />
            <Route path="/create" element={<Create />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
