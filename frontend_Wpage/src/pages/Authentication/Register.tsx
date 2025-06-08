import React, { useRef } from "react";
import { FetchData } from "@/services/FetchFromAPI";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser, clearUser } from "@/Utils/Slice/UserInfoSlice";
import { parseErrorMessage } from "@/Utils/ErrorMessageParser";

const Register = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const Dispatch = useDispatch();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    try {
      const response = await FetchData(
        "users/register",
        "post",
        formData
        // true
      );
      // console.log(response);
      localStorage.clear(); // will clear the all the data from localStorage
      localStorage.setItem(
        "AccessToken",
        response.data.data.tokens.AccessToken
      );
      localStorage.setItem(
        "RefreshToken",
        response.data.data.tokens.RefreshToken
      );
      Dispatch(clearUser());
      Dispatch(addUser(response.data.data.user));
      navigate("/");
      // alert(response.data.message);
      alert("Registered successfully ");
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert(parseErrorMessage(err.response?.data));
      window.location.reload();
    }
    console.log("Form submitted");
  };

  return (
    <div>
      <h1>Here we register</h1>
      <form onSubmit={handleSubmit} ref={formRef}>
        <input
          name="name"
          type="text"
          placeholder="Name"
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          name="number"
          type="number"
          placeholder="Contact Number"
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="mb-4 p-2 border rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
