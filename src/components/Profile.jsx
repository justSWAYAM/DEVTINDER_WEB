/* eslint-disable no-unused-vars */
import axios from "axios";
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser  = async () => {
    if(userData) return;
    try{
      const res = await axios.get(BASE_URL + "/profile/view" , {
        withCredentials: true,
      });
      dispatch(addUser(res.data)); 
    }
    catch(err){
      if(err.status == 401) navigate("/register");
      console.log(err);
    }
  };
  useEffect(() => {
  fetchUser();
  }, []);
  
  return (
    <div>Profile</div>
  )
}

export default Profile