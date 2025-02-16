import PropTypes from "prop-types";
import { X } from "lucide-react";
import Login from "./Login";
import { useNavigate } from "react-router-dom";

const Modal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-slate-900/90 p-8 rounded-2xl w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-rose-100 hover:bg-white/10 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
        <Login onSwitchToRegister={() => {
          onClose();
          navigate("/register");
          
        }} />
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
