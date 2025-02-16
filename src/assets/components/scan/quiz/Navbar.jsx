import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center p-4 bg-gray-800 text-white shadow-md">
      <button onClick={() => navigate(-1)} className="mr-4">
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
  );
};

export default Navbar;
