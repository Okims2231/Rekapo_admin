import toddImage from '../../assets/images/todd entity.jpg';

export default function ToddEntity({ isOpen, onClose }) {
  const loreText = `Todd is the only entity that does not seek to harm. He appears as a motionless figure in a worn brown suit, seated in a rusted shopping cart with a bright yellow Lego minifigure head atop his shoulders—its fixed, innocent smile glowing faintly under the green haze. Unlike the others, Todd never advances on his own; he only rolls forward a few quiet inches when no one is looking directly at him, repositioning just close enough to offer shelter. Wanderers who approach without aggression report that Todd silently points with one stiff arm toward safer paths—toward faint exits in the fog, toward flickering emergency lights that weren't there before, or toward hidden stashes of Almond Water tucked beneath overturned carts. He never speaks, but his unchanging smile and patient stillness seem to convey: stay calm, stay near, I will guide you out if you let me.`;

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
          left: '20px',
          maxWidth: '600px',
          width: 'auto',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-start',
          justifyContent: 'space-between'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px 10px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#ff6b6b';
            e.target.style.transform = 'scale(1.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#ffffff';
            e.target.style.transform = 'scale(1)';
          }}
        >
          ✕
        </button>

        <div style={{ flex: 1 }}>
          <p
            style={{
              color: '#ffffffff',
              fontFamily: 'Verdana, sans-serif',
              fontSize: '12px',
              lineHeight: '1.6',
              textAlign: 'left',
              letterSpacing: '0.2px',
              margin: 0,
              whiteSpace: 'pre-wrap',
            }}
          >
            {loreText}
          </p>
        </div>

        <div
          style={{
            backgroundImage: `url(${toddImage})`,
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
  );
}
