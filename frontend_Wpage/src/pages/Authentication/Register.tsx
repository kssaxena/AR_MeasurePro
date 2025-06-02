import React, { useRef } from "react";
import { FetchData } from "@/services/FetchFromAPI";

const Register = () => {
  const formRef = useRef(null);

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
      console.log(response);
      alert(
        "Please wait until our team completes the verification process. Please try logging in again."
      );
    } catch (err) {
      console.log(err);
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
