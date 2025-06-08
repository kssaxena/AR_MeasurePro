import { FetchData } from "@/services/FetchFromAPI";
import { parseErrorMessage } from "@/Utils/ErrorMessageParser";
import { addUser, clearUser } from "@/Utils/Slice/UserInfoSlice";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const Navigate = useNavigate();
  const Dispatch = useDispatch();
  const formRef = useRef(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    try {
      const response = await FetchData("users/login", "post", formData);
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

      alert(response.data.message);
      window.location.reload(); // Reload the page to reflect changes
      Dispatch(clearUser());
      Dispatch(addUser(response.data.data.user));
      Navigate("/");
    } catch (err) {
      console.log(err);
      // alert(parseErrorMessage(error.response.data.data.statusCode));
      alert(parseErrorMessage(err.response.data));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center z-50 w-full h-full">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-lg font-bold mb-4">Login</h2>
          <form onSubmit={handleSubmit} ref={formRef}>
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
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
