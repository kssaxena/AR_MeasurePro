import React, { useState } from "react";
import Login from "../pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";
import { useSelector } from "react-redux";

const Header = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const user = useSelector((store) => store.UserInfo.user);
  // console.log(user);

  const HandleLoginPopUp = () => {
    return (
      <div className="bg-white p-10">
        <Login />
        <button
          className="hover:text-blue-500 hover:underline"
          onClick={() => {
            setIsRegister(true), setIsLogin(false);
          }}
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
      {user.length === 1 ? (
        <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
          <h1 className="text-xl font-bold">Welcome, {user[0]?.name}</h1>
          <button
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
          <h1 className="text-xl font-bold">Welcome to Our App</h1>
          <button onClick={() => setIsLogin(true)}>Login</button>
        </div>
      )}
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
