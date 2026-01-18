import { Button, Dialog, DialogContent, Box, Typography } from '@mui/material';
import animatedKingImage from '../../assets/images/animatedking.png';
import animationsImage from '../../assets/images/animations.png';
import smilerImage from '../../assets/images/Smiler.jpg';

export default function AnimatedEntities({ isOpen, onClose }) {
  const descriptionStyles = {
    color: '#ffffffff',
    fontFamily: 'Verdana, sans-serif',
    fontSize: '12px',
    lineHeight: 1.7,
    textAlign: 'left',
    letterSpacing: '0.2px',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
  };

  const titleStyles = {
    color: '#ffffffff',
    fontFamily: 'Verdana, sans-serif',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '12px',
    textAlign: 'left',
  };

  const animatedKingDescription = `The Animated King is a jagged, stop-motion nightmare—a towering silhouette of shifting static and ink-black void that moves with the sickening, rhythmic stutter of a corrupted film reel. His crown is a crown of glitching thorns that bleed chromatic aberration into the air, while his tattered, liquid-shadow robes seem to absorb the very light around him, turning the world into a grainy, high-contrast burial ground. He does not breathe or speak; he simply exists as a localized collapse of reality, vibrating with the low-frequency hum of a dying projector and forcing everything in his presence to mimic his erratic, frame-by-frame movement until they snap under the tension of his unnatural "Motion."`;

  const animationsDescription = `Once the sun starts going down and the night arrives, Animations will spawn. If a wanderer is out in the open during the night, the Animations will start chasing them. They travel in groups and are faster than Wanderers, so escaping them is nearly impossible. In order to avoid them, you have to hide in a house. A house isn't completely safe from Animations, because they can break into houses. To keep them from breaking in, turn off the light using a Light Switch and/or hide underneath the Bed or in the Closet. If they figure out someone's in a house, they will come and knock on the door. At that point, if you're in a house, you only have a couple seconds to hide and avoid them killing you. Once the morning comes, all Animations will disappear until the next night.`;

  const smilerDescription = `Smilers, bearing the scientific name Subridens tenebris bestia, are an intelligent, highly malevolent, and exceedingly dangerous species of tartrean-class spectral entity, being distressingly common within regions of the Backrooms with low levels of light. Although formal research on these beings has been going on for decades on end, and documentation of them stretches back to prehistoric times with texts of non-human sapients, much about the nature of these entities remains a mystery to this very day. Serving as one of the few apex predators in the twisted ecosystem of this realm, Smilers lack any natural predators due to their unique aggression and prominent anomalous capabilities, being one of the most dangerous non-individual entities recorded thus far. Many wanderers end succumbing to the malevolence of these demons, their mangled corpses being strewn across the floor as a warning to future humans within this dimension.`;

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          position: 'fixed',
          top: '70px',
          left: '20px',
          right: 'auto',
          maxWidth: 700,
          width: '90vw',
          maxHeight: 'calc(100vh - 120px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
          m: 0,
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <DialogContent
        sx={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '1px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '1px',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.3)',
            },
          },
        }}
      >
        {/* Animated King */}
        <Box sx={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <Box
            sx={{
              width: 300,
              height: 280,
              minWidth: 300,
              backgroundImage: `url(${animatedKingImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography variant="h6" sx={titleStyles}>
              Animated King
            </Typography>
            <Typography variant="body2" sx={descriptionStyles}>
              {animatedKingDescription}
            </Typography>
          </Box>
        </Box>

        {/* Animations */}
        <Box sx={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <Box
            sx={{
              width: 300,
              height: 280,
              minWidth: 300,
              backgroundImage: `url(${animationsImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography variant="h6" sx={titleStyles}>
              Animations
            </Typography>
            <Typography variant="body2" sx={descriptionStyles}>
              {animationsDescription}
            </Typography>
          </Box>
        </Box>

        {/* Smilers */}
        <Box sx={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <Box
            sx={{
              width: 300,
              height: 280,
              minWidth: 300,
              backgroundImage: `url(${smilerImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography variant="h6" sx={titleStyles}>
              Smilers
            </Typography>
            <Typography variant="body2" sx={descriptionStyles}>
              {smilerDescription}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
