import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import UserCard from "../components/userCard";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { addFeed } from "../utils/feedSlice";
import axios from "axios";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const dispatch = useDispatch();

  const getFeed = async () => {
    if(feed) return;
    try {
      const res = await axios.get(BASE_URL + "/profile/feed" , {
        withCredentials: true,
      });
      
      dispatch(addFeed(res?.data));

    }
    catch (err) {
      console.log(err);
   }
  }
  useEffect(() => {
    getFeed();
  },[]);

  const handleSwipe = async (direction) => {
    if (direction === 'right') {
      // TODO: Add match logic here
      console.log('Liked profile:', feed[currentIndex].firstName);
    }
    
    // Wait for card animation to complete
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden"> {/* Add overflow-x-hidden */}
      <img
        src="/feed.jpeg"
        alt="Background"
        className="absolute w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />

      <div className="relative z-10">
        <div className="px-4 py-3">
          <Navbar />
        </div>

        {/* Cards Container - Add overflow control */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] overflow-hidden">
          {feed && currentIndex < feed.length ? (
            <UserCard 
              user={feed[currentIndex]} 
              onSwipe={handleSwipe}
            />
          ) : (
            <div className="text-center text-white">
              <h3 className="text-2xl font-semibold">No more profiles!</h3>
              <p className="text-gray-300">Check back later for more matches</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;