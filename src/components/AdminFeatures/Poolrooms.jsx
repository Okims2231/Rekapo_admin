import plore from '../../assets/images/plore.png';
import plore1 from '../../assets/images/plore1.jpg';
import plore2 from '../../assets/images/plore2.jpg';

export default function Poolrooms({ isOpen, onClose }) {
  const loreText = `  Level 37, commonly referred to as the Poolrooms, is an expansive complex of interconnected rooms and corridors submerged in undulating, lukewarm water. Each area of the level varies greatly in size and structure, ranging from uniform pools and hallways to more open, abnormally shaped areas. The majority of surfaces in the level are composed of white, ceramic tiling, with the only deviation from this color being the blue-green hue of the water. The tiles are eerily pristine in condition, all identical to one another, without a single hint of damage on their shiny surfaces.
  The architecture of Level 37 is varied, but strict in design; all areas in the level connect to one another in a senseless manner, with none having an easily identifiable purpose. Although the intended use of each area is difficult to determine, they are much too large to properly serve the function of a pool.`;

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
          border: '1px solid rgba(255, 255, 255, 0.2)',
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
          <div
            style={{
              backgroundImage: `url(${plore})`,
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
              backgroundImage: `url(${plore1})`,
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
              backgroundImage: `url(${plore2})`,
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
