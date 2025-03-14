import { Flame, Users2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeUser } from '../utils/userSlice';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
        await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
    } catch (error) {
        console.log(error);
    }
    dispatch(removeUser());
    navigate('/');
  };

  return (
    <div className="navbar bg-slate-900/95 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg px-4 max-w-5xl mx-auto">
      <div className="flex-1">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => navigate('/feed')}
        >
          <Flame className="w-8 h-8 text-orange-500" />
          <span className="text-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 bg-clip-text text-transparent font-semibold">
            Ignite
          </span>
        </div>
      </div>
      
      <div className="flex-none flex items-center gap-4">
        {/* Connections Button */}
        <button
          onClick={() => navigate('/connections')}
          className="btn btn-ghost btn-circle border border-rose-500/20 hover:border-rose-500/40 transition-colors"
        >
          <Users2 className="w-6 h-6 text-rose-400" />
        </button>

        {/* Existing Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-ghost btn-circle avatar border border-rose-500/20 hover:border-rose-500/40 transition-colors"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Profile"
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-slate-900/95 backdrop-blur-sm rounded-xl w-52 border border-white/10"
          >
            <li>
              <button 
                onClick={() => navigate('/profile')}
                className="text-rose-50 hover:text-rose-400 py-3"
              >
                Profile
              </button>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="text-rose-50 hover:text-rose-400 py-3"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;