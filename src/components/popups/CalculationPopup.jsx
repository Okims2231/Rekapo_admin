import { useState, useEffect } from 'react';

export default function Popup({ message, type = 'success', isOpen, onClose, autoCloseDuration = 4000 }) {
  useEffect(() => {
    if (isOpen && autoCloseDuration) {
      const timer = setTimeout(onClose, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDuration, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: isSuccess 
            ? 'rgba(60, 100, 60, 0.35)' 
            : 'rgba(120, 60, 60, 0.35)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '24px',
          padding: '32px 40px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
          border: isSuccess
            ? '2px solid rgba(100, 180, 90, 0.4)'
            : '2px solid rgba(220, 80, 80, 0.4)',
          maxWidth: '480px',
          textAlign: 'center',
          animation: 'popupSlideIn 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>
          {`
            @keyframes popupSlideIn {
              from {
                opacity: 0;
                transform: scale(0.9) translateY(-20px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          `}
        </style>

        <div style={{ marginBottom: '16px', fontSize: '28px' }}>
          {isSuccess ? '✨' : '⚠️'}
        </div>

        <p
          style={{
            color: '#ffffff',
            fontFamily: 'Verdana, sans-serif',
            fontSize: '18px',
            fontWeight: 500,
            margin: '0 0 24px 0',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
            lineHeight: '1.4',
          }}
        >
          {message}
        </p>

        <button
          onClick={onClose}
          style={{
            padding: '12px 32px',
            borderRadius: '16px',
            border: 'none',
            background: isSuccess
              ? 'linear-gradient(135deg, rgba(100, 180, 90, 0.9), rgba(80, 160, 70, 0.9))'
              : 'linear-gradient(135deg, rgba(220, 80, 80, 0.9), rgba(200, 50, 50, 0.9))',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#ffffff',
            cursor: 'pointer',
            fontFamily: 'Verdana, sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            textShadow: '0 2px 4px rgba(0,0,0,0.4)',
            boxShadow: isSuccess
              ? '0 6px 20px rgba(100, 180, 90, 0.4)'
              : '0 6px 20px rgba(220, 80, 80, 0.4)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = isSuccess
              ? '0 8px 28px rgba(100, 180, 90, 0.6)'
              : '0 8px 28px rgba(220, 80, 80, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = isSuccess
              ? '0 6px 20px rgba(100, 180, 90, 0.4)'
              : '0 6px 20px rgba(220, 80, 80, 0.4)';
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
