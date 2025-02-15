import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, initialForm = 'login' }) => {
  const [showContent, setShowContent] = useState(false);
  const [formType, setFormType] = useState(initialForm);

  useEffect(() => {
    if (isOpen) {
      setFormType(initialForm); // Update form type when modal opens
      const timer = setTimeout(() => setShowContent(true), 10);
      return () => clearTimeout(timer);
    }
    setShowContent(false);
  }, [isOpen, initialForm]);

  if (!isOpen) return null;

  const renderForm = () => {
    switch (formType) {
      case 'register':
        return (
          <>
            <h2 className="text-2xl mb-6 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 bg-clip-text text-transparent font-semibold">
              Create Account
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-rose-50 text-sm font-medium mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors" 
                  required 
                />
              </div>
              <div>
                <label className="block text-rose-50 text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors" 
                  required 
                />
              </div>
              <div>
                <label className="block text-rose-50 text-sm font-medium mb-2">Password</label>
                <input 
                  type="password" 
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors" 
                  required 
                />
              </div>
              <div>
                <label className="block text-rose-50 text-sm font-medium mb-2">Confirm Password</label>
                <input 
                  type="password" 
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors" 
                  required 
                />
              </div>
            </form>
          </>
        );
      case 'forgot':
        return (
          <>
            <h2 className="text-2xl mb-6 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 bg-clip-text text-transparent font-semibold">
              Reset Password
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-rose-50 text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors" 
                  required 
                />
              </div>
            </form>
          </>
        );
      default:
        return (
          <>
            <h2 className="text-2xl mb-6 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 bg-clip-text text-transparent font-semibold">
              Welcome Back
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-rose-50 text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors" 
                  required 
                />
              </div>
              <div>
                <label className="block text-rose-50 text-sm font-medium mb-2">Password</label>
                <input 
                  type="password" 
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-rose-50 focus:outline-none focus:border-rose-500 transition-colors" 
                  required 
                />
              </div>
            </form>
          </>
        );
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Enhanced glass effect backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-xl" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div 
          className={`relative bg-white/10 backdrop-blur-2xl p-8 rounded-2xl shadow-xl w-96 border border-white/20 transition-all duration-300 ease-in-out transform ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-rose-100" />
          </button>

          {renderForm()}
          
          <div className="mt-6 flex flex-col space-y-4">
            <button 
              type="submit" 
              className="w-full py-2.5 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 hover:opacity-90 rounded-full text-white text-sm transition-all"
            >
              {formType === 'login' ? 'Sign In' : formType === 'register' ? 'Create Account' : 'Reset Password'}
            </button>
            
            <div className="flex justify-center space-x-1 text-sm">
              {formType === 'login' ? (
                <>
                  <span className="text-rose-200">New here?</span>
                  <button 
                    onClick={() => setFormType('register')} 
                    className="text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  <span className="text-rose-200">Already have an account?</span>
                  <button 
                    onClick={() => setFormType('login')} 
                    className="text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
            
            {formType === 'login' && (
              <button 
                onClick={() => setFormType('forgot')} 
                className="text-sm text-rose-400 hover:text-rose-300 transition-colors"
              >
                Forgot your password?
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialForm: PropTypes.oneOf(['login', 'register', 'forgot'])
};

export default Modal;