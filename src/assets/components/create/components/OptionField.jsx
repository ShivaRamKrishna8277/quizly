import React from "react";

const OptionField = ({ index, value, onChange, selectedOption, setSelectedOption, onDelete }) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      {/* Radio Button to Mark as Correct */}
      <input
        type="radio"
        name="correctOption"
        checked={selectedOption === index}
        onChange={setSelectedOption}
        className="cursor-pointer"
      />

      {/* Option Input Field */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={`Option ${index + 1}`}
        className="border border-slate-200 w-full p-2 text-[10px] rounded outline-0"
      />

      {/* Delete Option Button */}
      <button onClick={onDelete} className="bg-red-500 text-white px-2 py-1 rounded text-[10px]">
        X
      </button>
    </div>
  );
};

export default OptionField;
