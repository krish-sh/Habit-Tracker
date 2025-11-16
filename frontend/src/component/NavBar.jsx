import React, { useContext } from "react";
import { HabitContext } from "../context/HabitContext";
import { useNavigate } from "react-router-dom";
import cookie from "js-cookie";

function NavBar() {
  const { token, setToken } = useContext(HabitContext);

  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-[#901E3E]">
      <div className="flex items-center">
        <img
          src=""
          onClick={() => navigate("/")}
          className="w-44 cursor-pointer"
          alt="logo"
        />
      </div>
      <div className="felx flex-col md:flex-row items-baseline justify-center space-y-3 md:space-y-3 mt-4 md:mt-0">
        {token ? (
          <button
            onClick={() => {
              cookie.remove("token");
              setToken(false);
              navigate("/Login");
            }}
            className="bg-[#901E3E] py-2 px-4 rounded-lg text-white font-semibold hover:bg-white hover:text-[#901E3E] transform duration-500"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#901E3E] py-2 px-4 rounded-lg text-white font-semibold   duration-500"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-white py-2 px-4 rounded-lg border border-[#7b0a2a96] text-[#901E3E] font-semibold hover:bg-[#901E3E] hover:text-white  duration-500"
            >
              SignUp
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default NavBar;
