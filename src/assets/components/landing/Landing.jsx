import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { faArrowRight, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import logo from "@/assets/images/logo.svg";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="p-4 flex flex-col gap-5">
      <img src={logo} alt="" className="w-[100px] mx-auto" />
      <Link to="/create">
        <div className="flex items-center justify-between bg-[#5C29C4] p-3 pe-5 rounded-md w-full text-white">
          <div className="flex gap-3">
            <div className="flex items-center justify-between p-2 px-3 bg-[#7442DB] rounded">
              <FontAwesomeIcon icon={faSquarePlus} className="text-5xl" />
            </div>
            <div>
              <p className="font-semibold text-2xl">Host a quiz</p>
              <p className="text-[10px] opacity-50 w-[80%]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Suscipit, tenetur!
              </p>
            </div>
          </div>
          <FontAwesomeIcon icon={faArrowRight} className="text-2xl" />
        </div>
      </Link>
      <Link to="/scan">
        <div className="flex items-center justify-between bg-[#FFCC00] p-3 pe-5 rounded-md w-full text-black">
          <div className="flex gap-3">
            <div className="flex items-center justify-between p-2 px-3 bg-[#f2dc85] rounded">
              <FontAwesomeIcon icon={faQrcode} className="text-5xl" />
            </div>
            <div>
              <p className="font-semibold text-2xl">Take a quiz</p>
              <p className="text-[10px] opacity-50 w-[80%]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Suscipit, tenetur!
              </p>
            </div>
          </div>
          <FontAwesomeIcon icon={faArrowRight} className="text-2xl" />
        </div>
      </Link>
    </div>
  );
};

export default Landing;
