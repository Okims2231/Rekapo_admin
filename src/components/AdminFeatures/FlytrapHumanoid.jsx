import flytraphuman from '../../assets/images/flytraphuman.jpg';
import flytraphuman2 from '../../assets/images/flytraphuman2.jpg';

export default function FlytrapHumanoid({ isOpen, onClose }) {
  const loreText = `The Flytrap Humanoid has the characteristic of being territorial since any element within their range can alarm them. It is rumored that it is "connected" with the environment and can "sense" any kind of movement at a far distance.

It is able to blend in with the environment. Because of this, it can be hard to detect, and the entity will act stealthily until prey walks by, in which case, the entity will attack at sudden and unexpected times.`;

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
              backgroundImage: `url(${flytraphuman})`,
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
              backgroundImage: `url(${flytraphuman2})`,
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
