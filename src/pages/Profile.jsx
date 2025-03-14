/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Upload, X, Flame } from 'lucide-react';
import Navbar from "../components/Navbar";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  const [error, setError] = useState("");
  const [tempSkill, setTempSkill] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    emailId: userData?.emailId || "",
    age: userData?.age || "",
    gender: userData?.gender || "male",
    photoUrl: userData?.photoUrl || "",
    about: userData?.about || "",
    skills: userData?.skills || [],
  });

  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      
      if (res.data) {
        dispatch(addUser(res.data));
        // Update form data with fresh server data
        setFormData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          emailId: res.data.emailId || "",
          age: res.data.age || "",
          gender: res.data.gender || "male",
          photoUrl: res.data.photoUrl || "",
          about: res.data.about || "",
          skills: res.data.skills || [],
        });
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      navigate("/register");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); // Empty dependency array for initial load only

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillAdd = (e) => {
    e.preventDefault();
    if (!tempSkill.trim()) return;
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
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({ ...formData, photoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("First name and last name are required");
      return;
    }
  
    if (!formData.age || formData.age < 18) {
      setError("Age must be 18 or above");
      return;
    }
  
    const updateData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      age: formData.age,
      gender: formData.gender,
      about: formData.about.trim(),
      skills: formData.skills,
      photoUrl: formData.photoUrl
    };
  
    try {
      const response = await axios.patch(
        `${BASE_URL}/profile/edit`,
        updateData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data) {
        dispatch(addUser({
          ...userData,
          ...updateData
        }));
        setError("✓ Profile updated successfully!");
      }
    } catch (err) {
      // Specific error handling
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError("Invalid data provided: " + err.response.data.message);
            break;
          case 401:
            setError("Please login again to update profile");
            navigate("/login");
            break;
          case 413:
            setError("Image size too large (max 5MB)");
            break;
          default:
            setError("Update failed: " + (err.response.data.message || "Unknown error"));
        }
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("Update failed: " + err.message);
      }
      console.error("Update error details:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-rose-500">Loading...</div>
      </div>
    );
  }

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
      
      <div className="px-4 py-3 ">
          <Navbar />
        </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left side - Form */}
              <div className="flex-1">
                <h2 className="text-2xl mb-6 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 bg-clip-text text-transparent font-semibold">
                  Edit Profile
                </h2>

                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="number"
                      name="age"
                      placeholder="Age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors"
                    />

                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
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

                  {error && <p className="text-red-400 text-sm">{error}</p>}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 hover:opacity-90 rounded-full text-white transition-all"
                  >
                    Update Profile
                  </button>
                </form>
              </div>

              {/* Right side - Preview Card */}
              <div className="w-full lg:w-96">
                <h3 className="text-xl mb-4 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 bg-clip-text text-transparent font-semibold">
                  Profile Preview
                </h3>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={previewImage || formData.photoUrl}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xl text-rose-50 font-medium">
                        {formData.firstName} {formData.lastName}
                      </h4>
                      <p className="text-rose-200 text-sm">
                        {formData.age} years • {formData.gender}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-rose-100 mb-4">{formData.about}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/10 rounded-full text-rose-200 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;