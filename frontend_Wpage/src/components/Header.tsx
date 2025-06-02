import React, { useState } from "react";
import Login from "../pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";

const Header = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const HandleLoginPopUp = () => {
    return (
      <div className="bg-white p-10">
        <Login />
        <button
          className="hover:text-blue-500 hover:underline"
          onClick={() => setIsRegister(true)}
        >
          to register, click here
        </button>
      </div>
    );
  };
  const HandleRegisterPopUp = () => {
    return (
      <div className="bg-white p-10">
        <Register />
      </div>
    );
  };

  return (
    <div className="w-full h-16">
      <button onClick={() => setIsLogin(true)}>Login</button>
      {isLogin && (
        <div className="fixed flex items-center justify-center w-full h-full top-0 left-0 z-10">
          <HandleLoginPopUp />
        </div>
      )}
      {isRegister && (
        <div className="fixed flex items-center justify-center w-full h-full top-0 left-0 z-10">
          <HandleRegisterPopUp />
        </div>
      )}
    </div>
  );
};

export default Header;
