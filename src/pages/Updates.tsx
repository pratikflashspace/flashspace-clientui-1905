import React from 'react';

interface UpdatesPopupProps {
  open: boolean;
  onClose: () => void;
}

const UpdatesPopup: React.FC<UpdatesPopupProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      top: '0',
      right: '0',
      width: '50vw',
      height: '100vh',
      background: '#fff',
      boxShadow: '-2px 0 8px rgba(0,0,0,.1)',
      zIndex: 1000,
      padding: '24px',
      overflowY: 'auto',
      transition: 'transform 0.3s ease',
    }}>
      <button style={{ float: 'right' }} onClick={onClose}>Close</button>
      <h2>Update & Notification</h2>
      {/* Your updates and notification content goes here */}
    </div>
  );
};

export default UpdatesPopup;
