import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OptionField from "./components/OptionField";
import { database, ref, push } from "../../../backend/firebase";

const Create = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState(""); // Store Question
  const [question, setQuestion] = useState(""); // Store Question
  const [options, setOptions] = useState(["", "", "", ""]); // Store Options
  const [correctOption, setCorrectOption] = useState(null); // Store Correct Option (null if not selected)
  const [questionsList, setQuestionsList] = useState([]); // Store All Questions
  const [loading, setLoading] = useState(false);

  const handleAddQuestion = () => {
    if (!question.trim()) {
      alert("Please enter a question!");
      return;
    }
    if (options.some((opt) => !opt.trim())) {
      alert("Please fill all options!");
      return;
    }
    if (correctOption === null) {
      alert("Please select a correct option!");
      return;
    }

    // Add question to the list
    setQuestionsList([...questionsList, { question, options, correctOption }]);

    // Reset the form
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectOption(null);
  };

  const handleDeleteOption = (index) => {
    if (options.length <= 2) {
      alert("At least two options are required.");
      return;
    }

    const newOptions = options.filter((_, i) => i !== index);

    // Adjust correctOption if it's deleted
    setCorrectOption(
      correctOption === index
        ? null
        : correctOption > index
        ? correctOption - 1
        : correctOption
    );

    setOptions(newOptions);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questionsList.filter((_, i) => i !== index);
    setQuestionsList(updatedQuestions);
  };

  const handleCreateQuiz = () => {
    if (!title.trim()) {
      alert("Enter the Title.");
      return;
    }

    if (!timeLimit.trim() || isNaN(timeLimit)) {
      alert("Enter a valid time limit. Only Numbers");
      return;
    }

    if (questionsList.length === 0) {
      alert("Add atleast one question");
      return;
    }

    try {
      setLoading(true);
      const quizRef = ref(database, "quizzes");
      const newQuizRef = push(quizRef, {
        title,
        timeLimit: Number(timeLimit),
        questions: questionsList,
        createdAt: new Date().toISOString(),
      });

      alert(`Quiz Created! Quiz ID: ${newQuizRef.key}`);

      // Reset form after successful creation
      setTitle("");
      setTimeLimit("");
      setQuestionsList([]);

      // Redirect to the desired page with quizId
      navigate(`/qr/${newQuizRef.key}`);
    } catch (error) {
      console.error("Error adding quiz: ", error);
      alert("Error creating quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative min-h-screen">
      <div className="flex items-center p-4 bg-gray-800 text-white shadow-mdshadow sticky top-0 z-9">
        <button onClick={() => navigate(-1)} className="mr-4">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className="text-lg font-bold">Create Quiz</h2>
      </div>

      <div className="p-3">
        <div className="mb-3">
          <label htmlFor="title" className="opacity-50 text-[10px] mb-1">
            Quiz Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Ex: General Knowledge"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-slate-200 font-medium outline-0 rounded p-2 text-[12px]"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="timeLimit" className="opacity-50 text-[10px] mb-1">
            Time limit
          </label>
          <input
            type="text"
            name="timeLimit"
            placeholder="Ex: 20 mins"
            onChange={(e) => setTimeLimit(e.target.value)}
            className="w-full border border-slate-200 font-medium outline-0 rounded p-2 text-[12px]"
          />
        </div>

        <div className="mb-3 flex flex-col gap-2">
          <label htmlFor="questions" className="opacity-50 text-[10px] mb-1">
            Questions
          </label>
          <input
            type="text"
            name="questions"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex: What is the capital city of India?"
            className="w-full border border-slate-200 font-medium outline-0 rounded p-2 text-[12px] mb-2"
          />

          {/* Render Options */}
          <div>
            {options.map((option, index) => (
              <OptionField
                key={index}
                index={index}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                selectedOption={correctOption}
                setSelectedOption={() => setCorrectOption(index)}
                onDelete={() => handleDeleteOption(index)}
              />
            ))}
          </div>

          <p
            className="text-blue-600 text-[10px] my-2 font-semibold text-end cursor-pointer"
            onClick={() => setOptions([...options, ""])}
          >
            Add option +
          </p>

          <button
            className="bg-green-600 text-white rounded p-2 text-[12px] font-semibold"
            onClick={handleAddQuestion}
          >
            Add Question
          </button>

          {questionsList.length > 0 && (
            <div className="mt-3 mb-6">
              {/* Display Added Questions */}
              <h3 className="text-xs opacity-50 font-semibold">
                Added Questions
              </h3>
              {questionsList.map((q, i) => (
                <div
                  key={i}
                  className="border p-2 my-2 rounded bg-gray-100 relative"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-[11px] text-wrap">
                      {q.question}
                    </p>
                    {/* Delete Question Button */}
                    <button
                      onClick={() => handleDeleteQuestion(i)}
                      className="text-red-600 text-[9px] font-semibold underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                  <ul className="list-disc ml-5 text-[9px]">
                    {q.options.map((opt, idx) => (
                      <li
                        key={idx}
                        className={
                          q.correctOption === idx
                            ? "font-bold text-green-600"
                            : ""
                        }
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full">
        <button
          className="bg-blue-600 text-white text-[12px] p-4 w-full"
          onClick={handleCreateQuiz}
        >
          {loading ? "Creating..." : "Create Quiz"}
        </button>
      </div>
    </div>
  );
};

export default Create;
