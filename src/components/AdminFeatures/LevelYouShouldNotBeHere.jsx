import lvlYouShouldNotBeHere1 from '../../assets/images/lvl youshouldnotbehere1.jpg';
import lvlYouShouldNotBeHere2 from '../../assets/images/lvl youshouldnotbehere2.jpg';
import lvlYouShouldNotBeHere3 from '../../assets/images/lvl youshouldnotbehere3.jpg';
import ImagePopup from './ImagePopup';

export default function LevelYouShouldNotBeHere({ isOpen, onClose }) {
  const loreText = `Level YouShouldNotBeHere is not rumor or alias—it is the name the level itself enforces, etched into every rusted signpost leaning from cracked curbs, scrawled in dripping condensation on fogged storefront windows, flickering on the solitary payphone’s cracked green display, and even surfacing in the peeling reflective paint of faded parking-lot arrows, as if the ground is issuing one final warning. This endless, suffocating expanse consists of derelict big-box parking lots stretching impossibly far, linked by cracked asphalt ribbons, half-finished access roads that vanish into nothing, and liminal suburban edges where skeletal strip-mall frames stand like the bones of an unfinished world. The air stays cold and damp, thick with glowing emerald mist that clings like liquid, illuminated by sparse sodium-vapor lamps whose sickly halos dissolve into fog within meters, and by rare, dying floodlights buzzing on rusted poles, their light flickering as though the level itself craves only eternal twilight.`;

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
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
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
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Image 1 - Placeholder for user to add */}
          <ImagePopup src={lvlYouShouldNotBeHere1}>
            <div
              style={{
                backgroundImage: `url(${lvlYouShouldNotBeHere1})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '6px',
                width: '350px',
                height: '200px',
                minWidth: '300px',
                position: 'relative',
                overflow: 'hidden'
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
          </ImagePopup>

          {/* Image 2 - Placeholder for user to add */}
          <ImagePopup src={lvlYouShouldNotBeHere2}>
            <div
              style={{
                backgroundImage: `url(${lvlYouShouldNotBeHere2})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '6px',
                width: '350px',
                height: '200px',
                minWidth: '300px',
                position: 'relative',
                overflow: 'hidden'
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
          </ImagePopup>

          {/* Image 3 - Placeholder for user to add */}
          <ImagePopup src={lvlYouShouldNotBeHere3}>
            <div
              style={{
                backgroundImage: `url(${lvlYouShouldNotBeHere3})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '6px',
                width: '350px',
                height: '200px',
                minWidth: '300px',
                position: 'relative',
                overflow: 'hidden'
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
          </ImagePopup>
        </div>
      </div>
    </div>
  );
}
