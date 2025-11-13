import React, { useContext, useState } from "react";
import { HabitContext } from "../context/HabitContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { handleLogin } = useContext(HabitContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmiit = async (e) => {
    e.preventDefault();

    const res = await handleLogin(formData);
    if (res?.success) {
      toast.success("Login successfully");
      navigate("/");
    } else {
      toast.error("Invalid credantials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-8">Login</h2>

        <form onSubmit={handleSubmiit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:bg-white outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:bg-white outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Don't have a account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Signup here
          </a>
        </p>
      </div>
    </div>
  );
}
