import { Dialog, DialogContent, Box, Typography } from '@mui/material';
import lheaven from '../../assets/images/lheaven.jpg';
import lheaven2 from '../../assets/images/lheaven2.jpg';
import lvlheaven3 from '../../assets/images/lheaven3.jpg';

export default function LevelHeaven({ onClose }) {
  const levelHeavenDescription = `Level "Heaven?" is a non-linear, infinite expanse resembling the upper troposphere, characterized by a boundless sea of pristine, white cumulonimbus clouds beneath a piercingly bright, deep blue sky. Unlike natural vapor, this cloud floor is solid enough to traverse, possessing the texture of dense, damp cotton or aerogel known as "Cloudcrete," though experienced wanderers warn of "soft spots"—patches of false density that drop victims indefinitely into the "Blue Void" beneath the level's crust. The air remains fixed at a cool 15°C and carries the sterile, distinct scent of ozone and sanitized hospital linens, creating the unsettling impression that the entire realm is a preserved medical sample rather than an afterlife. The environment is defined by an unnerving, acoustically dampened silence; despite the open air, there is no wind to carry sound, meaning voices do not echo and the only noise is the wet crunch of one's own footsteps. With the sun locked permanently at a high-noon position, casting no shadows and rendering time impossible to track, the level traps wanderers in a disorienting stasis of eternal daylight known as "Divine Ennui," a psychological hazard where the lack of visual contrast and sleep cycles causes rapid memory erosion and catatonia. This pristine sterility is strictly enforced by the Aether-Walkers, the skeletal giants that roam the horizon; while usually docile, they act as the level's immune system, and any attempt to damage the cloud structures or create excessive noise causes the eternal blue sky to instantly bruise into a violent grey, summoning the entities to purge the "contaminant. Some wanderers glimpse distant rectangular openings glowing gold and humming softly, but those who approach either see them vanish or awaken moments later with no memory of what occurred.`;

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
          maxWidth: '800px',
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
          <h3
            style={{
              color: '#ffffffff',
              fontFamily: 'Verdana, sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              marginBottom: '12px',
              textShadow: '0 2px 4px rgba(0,0,0,0.6)',
              margin: '0 0 12px 0',
            }}
          >
            Level "Heaven?"
          </h3>
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
            {levelHeavenDescription}
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
              backgroundImage: `url(${lheaven})`,
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
              backgroundImage: `url(${lheaven2})`,
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
              backgroundImage: `url(${lvlheaven3})`,
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
