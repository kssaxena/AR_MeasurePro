import React from "react";

const Login = () => {
  return (
    <div>
      <div className="flex items-center justify-center z-50 w-full h-full">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-lg font-bold mb-4">Login</h2>
          <form>
            <input
              type="number"
              placeholder="Contact Number"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
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
