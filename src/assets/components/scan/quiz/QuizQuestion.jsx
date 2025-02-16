import React from "react";

const QuizQuestion = ({ question, index, totalQuestions, onSelectAnswer, selectedAnswer }) => {
  return (
    <div className="py-6">
      <h3 className="text-xl font-semibold mb-4">
        Question {index + 1} of {totalQuestions}
      </h3>
      <p className="text-lg mb-4">{question.question}</p>

      <ul className="space-y-3">
        {question.options.map((option, idx) => (
          <li
            key={idx}
            className={`p-3 rounded-lg cursor-pointer ${
              selectedAnswer === idx ? "bg-green-100 text-green-500 border border-green-500 font-semibold" : "bg-gray-100"
            }`}
            onClick={() => onSelectAnswer(index, idx)}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizQuestion;
