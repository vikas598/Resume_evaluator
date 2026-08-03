import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);

  const handleToggle = () => {
    if (type === "password") {
      setType("text");
      setIcon(eye);
    } else {
      setType("password");
      setIcon(eyeOff);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();

      formData.append("username", mail.trim());
      formData.append("password", password);

      const response = await api.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      localStorage.setItem("token", response.data.access_token);
      navigate("/upload-jd");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-evaluate">
          Resume Evaluator
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          AI-Powered Resume Screening
        </p>

        <h2 className="text-xl font-semibold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <input
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-evaluate"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={type}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-evaluate"
              />

              <button
                type="button"
                onClick={handleToggle}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                <Icon icon={icon} size={20} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-evaluate hover:bg-evaluate text-white py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?
        </p>

        <p className="text-center">
          <a
            href="/register"
            className="text-evaluate hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;