import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Upload, X, Flame } from 'lucide-react';
import axios from "axios";
import Modal from "./Modal"; // Add this import
import { addUser } from "../utils/userSlice"; // Add this import
import {BASE_URL} from "../utils/constants"; // Adjust the import path as necessary

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Add this
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "male",
    photoUrl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    about: "",
    skills: [],
  });
  const [error, setError] = useState("");
  const [tempSkill, setTempSkill] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false); // Add state for modal

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, photoUrl: url });
    
    // Update preview if URL is valid
    if (url) {
      const img = new Image();
      img.onload = () => {
        setPreviewImage(url);
        setError(""); // Clear any previous errors
      };
      img.onerror = () => {
        setPreviewImage(null);
        setError("Invalid image URL");
      };
      img.src = url;
    } else {
      setPreviewImage(null);
    }
  };

  const handleSkillAdd = (e) => {
    e.preventDefault();
    if (!tempSkill.trim()) {
      setError("Skill cannot be empty");
      return;
    }
    
    if (formData.skills.length >= 10) {
      setError("Maximum 10 skills allowed");
      return;
    }
  
    if (tempSkill && !formData.skills.includes(tempSkill.toLowerCase())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, tempSkill.toLowerCase()]
      });
      setTempSkill("");
      setError(""); // Clear any existing errors
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation checks
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("First name and last name are required");
      return;
    }
  
    if (!validateEmail(formData.emailId)) {
      setError("Please enter a valid email address");
      return;
    }
  
    if (!validatePassword(formData.password)) {
      setError("Password must be at least 6 characters long");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 18 || age > 100) {
      setError("Age must be between 18 and 100");
      return;
    }
  
    if (!formData.about.trim()) {
      setError("Please provide a brief description about yourself");
      return;
    }
  
    if (formData.skills.length === 0) {
      setError("Please add at least one skill");
      return;
    }
  
    // Replace the problematic base64 check with simple URL validation
    if (formData.photoUrl && formData.photoUrl !== "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png") {
      try {
        const response = await fetch(formData.photoUrl);
        const contentType = response.headers.get('content-type');
        if (!contentType.startsWith('image/')) {
          setError("Please provide a valid image URL");
          return;
        }
      } catch (err) {
        setError("Please provide a valid image URL");
        console.log(err);
        return;
      }
    }

    try {
      // First, attempt to register
      const registerResponse = await axios.post(`${BASE_URL}/signup`, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        emailId: formData.emailId.trim(),
        password: formData.password,
        age: parseInt(formData.age),
        gender: formData.gender,
        photoUrl: formData.photoUrl,
        about: formData.about.trim(),
        skills: formData.skills,
      });

      if (registerResponse.data) {
        // If registration successful, attempt to login
        try {
          const loginResponse = await axios.post(`${BASE_URL}/login`, {
            emailId: formData.emailId,
            password: formData.password
          }, { withCredentials: true });

          if (loginResponse.data) {
            dispatch(addUser(loginResponse.data.user));
            navigate('/feed');
          }
        } catch (loginErr) {
          console.error("Auto-login failed:", loginErr);
          navigate('/'); // Fallback to landing page if auto-login fails
        }
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Email already exists");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
      console.error(err);
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <img
        src="/register.jpg"
        alt="Background"
        className="absolute w-full h-full object-cover"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/40" />

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-5 border-b border-white/10">
          <div 
            className="flex items-center space-x-2 ml-8 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <Flame className="w-12 h-12 text-orange-500 mb-[0.5rem]" />
            <span className="text-3xl bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 bg-clip-text text-transparent">
              Ignite
            </span>
          </div>
        </nav>

        {/* Form Container */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-sm p-4 sm:p-8 rounded-2xl border border-white/10">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left side - Form */}
              <div className="flex-1">
                <h2 className="text-2xl mb-6 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 bg-clip-text text-transparent font-semibold">
                  Create Account
                </h2>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors"
                      required
                    />
                  </div>

                  <input
                    type="email"
                    name="emailId"
                    placeholder="Email"
                    value={formData.emailId}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="number"
                      name="age"
                      placeholder="Age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors"
                      required
                      min="18"
                      max="100"
                    />

                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors appearance-none cursor-pointer [&>option]:bg-slate-900"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em'
                      }}
                      required
                    >
                      <option value="male" className="text-rose-50 bg-slate-900">Male</option>
                      <option value="female" className="text-rose-50 bg-slate-900">Female</option>
                      <option value="other" className="text-rose-50 bg-slate-900">Other</option>
                    </select>
                  </div>

                  <textarea
                    name="about"
                    placeholder="About you"
                    value={formData.about}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors resize-none h-24"
                  />

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempSkill}
                        onChange={(e) => setTempSkill(e.target.value)}
                        placeholder="Add your skills"
                        className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors"
                      />
                      <button
                        onClick={handleSkillAdd}
                        className="px-4 py-2 bg-rose-500 rounded-lg text-white hover:bg-rose-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/10 rounded-full text-rose-200 text-sm flex items-center gap-2"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="text-rose-400 hover:text-rose-300"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors"
                    required
                    minLength="6"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors"
                    required
                    minLength="6"
                  />

                  {error && <p className="text-red-400 text-sm">{error}</p>}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 hover:opacity-90 rounded-full text-white transition-all"
                  >
                    Create Account
                  </button>
                </form>

                <div className="mt-4 text-center text-sm">
                  <span className="text-rose-200">Already have an account? </span>
                  <button
                    onClick={handleLoginClick}
                    className="text-rose-400 hover:text-rose-300"
                  >
                    Sign In
                  </button>
                </div>

                {/* Add Modal component */}
                <Modal 
                  isOpen={showLoginModal} 
                  onClose={handleCloseModal}
                  initialForm="login"
                />
              </div>

              {/* Right side - Photo Upload */}
              <div className="space-y-4">
                <input
                  type="url"
                  name="photoUrl"
                  placeholder="Profile Photo URL"
                  value={formData.photoUrl}
                  onChange={handlePhotoUrlChange}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors"
                />
                
                {/* Remove the file input from the right side and update the preview section */}
                <div className="w-full lg:w-72 flex flex-col items-center justify-center">
                  <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden mb-4 bg-white/10 backdrop-blur-sm border border-white/20 relative group">
                    <img
                      src={previewImage || formData.photoUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <p className="text-rose-200 text-sm text-center mb-4 lg:mb-0">
                    Enter a valid image URL above to preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showLoginModal && (
        <Modal onClose={handleCloseModal}>
          {/* Modal content goes here */}
        </Modal>
      )}
    </div>
  );
};

export default Register;