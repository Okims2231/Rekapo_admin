import { useState } from 'react';
import grassrooms1 from '../../assets/images/grassrooms1.jpg';
import grassrooms2 from '../../assets/images/grassrooms2.jpg';
import grassrooms3 from '../../assets/images/grassrooms3.jpg';
import grassrooms4 from '../../assets/images/grassrooms4.jpg';

export default function Lvl807({ isOpen, onClose }) {
  const loreText = `Level 807 is similar to level 0, but the differences is the level's floor is filled with grass, the wall is white and doesn't has ceiling. Even this level is labyrinth type, but the nature fresh air can be feel, flower can grow in level floor and there's some break room that wanderers can rest and restocking food and drinks. One of person named "Azka" accidentally noclip to this level, he feels fresh air and nature sensation, he found some small tree, breakroom with chair, food and drinks and almond water fountain. The wall is indestructible, so nobody can destroy the wall.

Every ailments will instantly cured when you enter this level. So, you never get sick in this level because the air make nature sensation and stronging your body immune. Bad microbe can't be found, all liquid substances in this level is healthy and safe to drink.`;

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        backgroundColor: 'transparent',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'fixed',
          top: '70px',
          right: '20px',
          maxWidth: '600px',
          width: 'auto',
          backgroundColor: 'rgba(60, 80, 60, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(120, 160, 100, 0.3)',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              color: '#f5f5f5',
              fontFamily: 'Verdana, sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              lineHeight: '1.8',
              textAlign: 'left',
              letterSpacing: '0.3px',
              margin: 0,
              whiteSpace: 'pre-wrap',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            }}
          >
            {loreText}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div
            style={{
              backgroundImage: `url(${grassrooms1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '6px',
              width: '350px',
              height: '200px',
              minWidth: '300px',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}
            />
          </div>

          <div
            style={{
              backgroundImage: `url(${grassrooms2})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '6px',
              width: '350px',
              height: '200px',
              minWidth: '300px',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}
            />
          </div>

          <div
            style={{
              backgroundImage: `url(${grassrooms3})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '6px',
              width: '350px',
              height: '200px',
              minWidth: '300px',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}
            />
          </div>

          <div
            style={{
              backgroundImage: `url(${grassrooms4})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '6px',
              width: '350px',
              height: '200px',
              minWidth: '300px',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
