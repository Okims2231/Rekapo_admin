import toddImage from '../../assets/images/todd entity.jpg';
import headlessImage from '../../assets/images/headless entity.jpg';
import cautionSignImage from '../../assets/images/caution sign entity.jpg';

export default function Entities({ isOpen, onClose }) {
  const entities = [
    {
      name: 'Todd',
      image: toddImage,
      lore: `Todd is the only entity that does not seek to harm. He appears as a motionless figure in a worn brown suit, seated in a rusted shopping cart with a bright yellow Lego minifigure head atop his shoulders—its fixed, innocent smile glowing faintly under the green haze. Unlike the others, Todd never advances on his own; he only rolls forward a few quiet inches when no one is looking directly at him, repositioning just close enough to offer shelter. Wanderers who approach without aggression report that Todd silently points with one stiff arm toward safer paths—toward faint exits in the fog, toward flickering emergency lights that weren't there before, or toward hidden stashes of Almond Water tucked beneath overturned carts. He never speaks, but his unchanging smile and patient stillness seem to convey: stay calm, stay near, I will guide you out if you let me.`
    },
    {
      name: 'Headless',
      image: headlessImage,
      lore: `Headless is the silent sentinel of finality. A tall, faceless figure in a heavy coat stands motionless in the center of vast, empty parking fields, back turned, an abandoned shopping cart lying on its side a few paces behind like a broken shadow. He never moves toward you, yet the fog always clears a perfect circle around him, framing a distant, unreachable store facade that promises escape but never draws closer. If you shout or shine a light, Headless slowly turns—not to reveal a face, but to show only an empty hood—then returns to his vigil. The longer you watch, the more your own silhouette begins to appear beside him in the distance: same posture, same coat, same hollow absence where a head should be. Those who linger too long feel their consciousness begin to detach, slipping forward to join Headless while their body remains behind, empty and waiting.`
    },
    {
      name: 'Caution Sign Entity',
      image: cautionSignImage,
      lore: `Caution Sign Entity, by contrast, is pure malice disguised as warning. It manifests as the cluster of contradictory road signs clustered around a solitary, leaning palm trunk: "SPEED LIMIT 20," the eroded "CAUTION Watch for ren," and the yellow diamond bearing a hunched, ape-like silhouette. The entity does not chase—it infects. The fog thickens the moment you draw near, the speed-limit numbers begin counting backward in your peripheral vision, and distorted primate shrieks twist into mocking child voices that urge you to run. If you give in to panic and sprint, your movements slow to a crawl as if wading through tar; the signs multiply, hemming you in tighter circles until you stand frozen, staring at the ape silhouette now towering just outside the lamplight, ready to drag anything that disobeys the unspoken rule straight into the mist.`
    }
  ];

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
          maxWidth: '800px',
          width: 'auto',
          maxHeight: '80vh',
          overflowY: 'auto',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
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

        {/* Title */}
        <h2 style={{
          color: '#ffffff',
          fontFamily: 'Verdana, sans-serif',
          fontSize: '18px',
          margin: '0 0 10px 0',
          textShadow: '0 2px 4px rgba(0,0,0,0.6)'
        }}>
          Entities
        </h2>

        {/* Entities List */}
        {entities.map((entity, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              gap: '15px',
              padding: '15px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '6px'
            }}
          >
            {/* Image */}
            <div
              style={{
                backgroundImage: `url(${entity.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '6px',
                width: '250px',
                height: 'auto',
                minWidth: '250px',
                minHeight: '200px',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0
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

            {/* Text */}
            <div style={{ flex: 1 }}>
              <h3 style={{
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                fontSize: '14px',
                margin: '0 0 10px 0',
                textShadow: '0 1px 3px rgba(0,0,0,0.6)'
              }}>
                {entity.name}
              </h3>
              <p
                style={{
                  color: '#ffffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontSize: '11px',
                  lineHeight: '1.5',
                  textAlign: 'left',
                  letterSpacing: '0.1px',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {entity.lore}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
