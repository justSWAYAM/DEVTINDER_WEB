import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import UserCard from "../components/userCard";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import axios from "axios";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Add debug log for feed data
  useEffect(() => {
    console.log("Current feed state:", feed);
  }, [feed]);

  // Fetch feed data
  const getFeed = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/feed`, {
        withCredentials: true,
      });
      console.log("API Response:", res?.data); // Debug log
      
      // Extract the array from data property
      const feedArray = res?.data?.data || [];
      if (Array.isArray(feedArray)) {
        dispatch(addFeed(feedArray));
      }
    } catch (err) {
      console.error("Error fetching feed:", err);
      dispatch(addFeed([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // Handle swipe actions
  const handleSwipe = async (direction) => {
    if (!feed?.length) return;

    const currentUser = feed[0]; // Always use the first user
    
    try {
      // Handle right swipe (interested)
      if (direction === 'right') {
        await axios.post(
          `${BASE_URL}/request/send/interested/${currentUser._id}`,
          { userId: currentUser._id },
          { withCredentials: true }
        );
      } 
      // Handle left swipe (rejected)
      else if (direction === 'left') {
        await axios.post(
          `${BASE_URL}/request/send/ignored/${currentUser._id}`,
          { userId: currentUser._id },
          { withCredentials: true }
        );
      }

      // Remove swiped user from feed
      const updatedFeed = feed.slice(1); // Remove first user
      dispatch(addFeed(updatedFeed));

    } catch (err) {
      console.error("Error handling swipe:", err);
    }
  };

  // Modified render logic
  const renderContent = () => {
    console.log("Rendering with:", { 
      loading, 
      feedExists: !!feed, 
      feedLength: feed?.length,
      firstUser: feed?.[0]
    });

    if (loading) {
      return (
        <div className="text-center text-white">
          <h3 className="text-2xl font-semibold">Loading profiles...</h3>
        </div>
      );
    }

    // Check for valid feed array with items
    if (Array.isArray(feed) && feed.length > 0) {
      return (
        <UserCard 
          user={feed[0]}
          onSwipe={handleSwipe}
        />
      );
    }

    // Show no profiles message for empty feed
    return (
      <div className="text-center text-white">
        <h3 className="text-2xl font-semibold">No more profiles!</h3>
        <p className="text-gray-300">Check back later for more matches</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <img
        src="/feed.jpeg"
        alt="Background"
        className="absolute w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />

      <div className="relative z-10">
        <div className="px-4 py-3">
          <Navbar />
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Feed;