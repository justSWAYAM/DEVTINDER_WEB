/* eslint-disable react/prop-types */
import { useState } from 'react';
import { X, Heart, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

const UserCard = ({ user, onSwipe }) => {
  const [swipeDirection, setSwipeDirection] = useState(null);

  const handleSwipe = (direction) => {
    setSwipeDirection(direction);
    setTimeout(() => {
      onSwipe(direction);
      setSwipeDirection(null);
    }, 300);
  };

  return (
    <div className="relative overflow-hidden"> {/* Add wrapper div with overflow control */}
      <motion.div
        className="relative w-[320px] h-[480px] rounded-2xl overflow-hidden border border-white/10 shadow-xl"
        initial={{ scale: 1, opacity: 1 }}
        animate={{
          x: swipeDirection === 'left' ? -1000 : swipeDirection === 'right' ? 1000 : 0,
          rotate: swipeDirection === 'left' ? -30 : swipeDirection === 'right' ? 30 : 0,
          opacity: swipeDirection ? 0 : 1
        }}
        transition={{ 
          duration: 0.3,
          x: { type: "tween", ease: "easeOut" } // Add smooth easing
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(e, { offset }) => {
          if (offset.x < -100) handleSwipe('left');
          else if (offset.x > 100) handleSwipe('right');
        }}
      >
        {/* Full height image container */}
        <div className="relative w-full h-full">
          <img 
            src={user.photoUrl} 
            alt={`${user.firstName}'s profile`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Compact content overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 space-y-2">
            {/* Name and Age - Smaller but still prominent */}
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 bg-clip-text text-transparent">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-rose-200 text-sm">{user.age} years old</p>
            </div>

            {/* Compact about section */}
            <p className="text-rose-100/90 text-xs leading-relaxed line-clamp-2 backdrop-blur-sm bg-black/20 rounded-lg px-2 py-1.5">
              {user.about || "No description provided"}
            </p>

            {/* Compact skills */}
            <div className="flex flex-wrap gap-1.5">
              {user.skills?.length > 0 ? (
                user.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-2 py-0.5 bg-rose-500/20 backdrop-blur-sm border border-rose-500/30 rounded-full text-rose-200 text-xs flex items-center gap-1"
                  >
                    <Code2 size={10} />
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-rose-200/60 text-xs italic">No skills yet</span>
              )}
            </div>

            {/* Compact buttons */}
            <div className="flex justify-center gap-4 pt-2">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSwipe('left')}
                className="w-12 h-12 bg-rose-500/10 backdrop-blur-md border border-rose-500/30 rounded-full flex items-center justify-center hover:bg-rose-500/30 transition-all"
              >
                <X className="text-rose-300" size={20} />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSwipe('right')}
                className="w-12 h-12 bg-green-500/10 backdrop-blur-md border border-green-500/30 rounded-full flex items-center justify-center hover:bg-green-500/30 transition-all"
              >
                <Heart className="text-green-300" size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserCard;