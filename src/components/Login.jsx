import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const Login = ({ onSwitchToRegister }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(BASE_URL +"/login", formData, { withCredentials: true });

      if (response.data) {
        dispatch(addUser(response.data.user));
        navigate("/profile");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.log(err);
    }
  };

  return (
    <>
      <h2 className="text-2xl mb-6 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 bg-clip-text text-transparent font-semibold">
        Welcome Back
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            type="email"
            name="emailId"
            placeholder="Email"
            value={formData.emailId}
            onChange={handleInputChange}
            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors"
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors"
            required
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full py-2.5 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 hover:opacity-90 rounded-full text-white transition-all"
        >
          Sign In
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        <span className="text-rose-200">Don&apos;t have an account? </span>
        <button
          onClick={onSwitchToRegister}
          className="text-rose-400 hover:text-rose-300"
        >
          Sign Up
        </button>
      </div>
    </>
  );
};

Login.propTypes = {
  onSwitchToRegister: PropTypes.func.isRequired,
};

export default Login;