// filepath: /c:/Users/justs/Desktop/DEVTINDER_WEB/src/pages/landingpage.jsx
import { useState } from 'react';
import { Sparkles, Flame } from 'lucide-react';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState('login');

  const openModal = (type) => {
    setFormType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormType('login'); // Reset to default when closing
  };

  const handleStartJourney = () => {
    navigate('/register');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <img
        src="/landingpage-modified.jpg"
        alt="Landing Page"
        className="absolute w-full h-full object-cover"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
       
              <nav className="flex justify-between items-center p-5">
              <div className="flex items-center space-x-2 ml-8">
                <Flame className="w-12 h-12 text-orange-500 mb-[0.5rem]" />
                <span className="text-3xl bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 bg-clip-text text-transparent">
                Ignite
                </span>
              </div>
              <div className="space-x-4">
                <button 
                className="px-4 py-1.5 text-orange-300 hover:text-orange-200 transition-colors text-sm" 
                onClick={() => openModal('login')}
                >
                Login
                </button>
                <button 
                className="px-5 py-1.5 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 hover:opacity-90 rounded-full text-white text-sm transition-all" 
                onClick={() => navigate('/register')}
                >
                Sign Up
                </button>
              </div>
              </nav>

              {/* Main Content - Left Aligned and Shifted Up */}
            <div className="flex-1 flex items-center px-12 md:px-16 -mt-8">
              <div className="max-w-xl">
              <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-transparent bg-clip-text">
                <h2 className="text-lg mb-1">Dating Redefined</h2>
              </div>
              
              <h1 className="text-5xl text-white mb-5 leading-tight">
                Find Love in a
                <span className="block bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 bg-clip-text text-transparent">
                Digital World
                </span>
              </h1>
              
              <p className="text-lg text-rose-50 mb-6 max-w-lg">
                Experience dating that&apos;s as unique as you are. Join our vibrant community today.
              </p>

              {/* CTA Section */}
            <div className="flex items-center space-x-6">
              <button 
                className="group px-6 py-3 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 hover:opacity-90 rounded-full text-white text-base transition-all flex items-center space-x-2" 
                onClick={handleStartJourney}
              >
                <span>Start Your Journey</span>
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </button>
              
              {/* Stats in a row */}
              <div className="flex space-x-6">
                <div>
                  <div className="text-xl bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">2M+</div>
                  <div className="text-rose-200 text-xs">Active Users</div>
                </div>
                <div>
                  <div className="text-xl bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">95%</div>
                  <div className="text-rose-200 text-xs">Match Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        initialForm={formType}
      />
    </div>
  );
};

export default LandingPage;