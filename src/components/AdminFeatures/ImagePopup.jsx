import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ImagePopup({ src, children, style, sx, onClick, ...props }) {
  const [popupOpen, setPopupOpen] = useState(false);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (popupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [popupOpen]);

  const handleOpen = (e) => {
    e.stopPropagation();
    setPopupOpen(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setPopupOpen(false);
  };

  return (
    <>
      {/* Wrap the children or render a clickable image container */}
      <div
        onClick={handleOpen}
        style={{
          cursor: 'pointer',
          position: 'relative',
          ...style,
        }}
        {...props}
      >
        {children}
      </div>

      {/* Fullscreen Popup — portaled to document.body so it escapes all parent z-index / overflow */}
      {popupOpen && createPortal(
        <div
          onClick={handleClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999999,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              fontSize: '28px',
              cursor: 'pointer',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'all 0.2s ease',
              zIndex: 1000000,
              fontFamily: 'Verdana, sans-serif',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ✕
          </button>

          <img
            src={src}
            alt="Full size preview"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '92vw',
              maxHeight: '92vh',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 0 80px rgba(0, 0, 0, 0.9)',
              cursor: 'default',
            }}
          />
        </div>,
        document.body
      )}
    </>
  );
}
