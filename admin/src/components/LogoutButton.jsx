// LogoutButton.jsx
import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const LogoutButton = ({ onLogout, className }) => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirmLogout = () => {
    setShowModal(false); // Close modal first
    
    // Small delay to ensure modal closes before logout
    setTimeout(() => {
      onLogout(); // This will call your handleLogout function
    }, 100);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={className}
      >
        Logout
      </button>
      
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
      />
    </>
  );
};

export default LogoutButton;
