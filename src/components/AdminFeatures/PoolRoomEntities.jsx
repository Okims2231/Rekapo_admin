import { useState } from 'react';
import { Button, Dialog, DialogContent, Box, Typography } from '@mui/material';
import skinstealer from '../../assets/images/skinstealer1.jpg';
import glitchton from '../../assets/images/glitchton.jpg';
import weepingangel from '../../assets/images/weepingangel.png';

export default function PoolRoomEntities({ isOpen, onClose }) {
  // Reusable styles
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

  const skinStealerDescription = `The Skin Stealer is a seemingly skinless, tall, and thin humanoid with elongated limbs, a distinct long and horrifying mouth, decorated with tiny sharp teeth. It has two small, red eyes that peer through the darkness.
  The creature is relatively slow and docile when wandering, but when it is after you, it can run nearly at person sprinting speed, and is hard to escape without a Moth Jelly or Locker. Both types are attracted to noise, such as the sound of eating pills or whistling. It can sense you from a farther distance if you are injured. It is however quite easy to dodge, as sprinting past it on its side should suffice.`;

  const glitchtonDescription = `Glitchtons have the appearance of skeletons from the Frontrooms, but neon-colored. They usually hide in vents inside the pools, emerge and attack you when you get close to them. They dip themselves with liquid silence so you wont hear them coming, avoid the danger zones of the poolrooms as much as possible.
  Glitchtons attack by jumping out of the water and grabbing you, dealing damage over time until they are removed. They can be removed by using a flashlight or any light source, as they are afraid of light. They can also be stunned temporarily by splashing water on them, allowing you to escape.`;

  const weepingAngelDescription = `The Weeping Angels of the Still Water is a porcelain-skinned entity that remains a frozen statue only as long as it is watched. The moment a wanderer blinks, it moves with silent, ripple-less speed to close the distance. Upon contact, it kills by instantly vacuuming all heat and moisture from the victim, leaving behind a dry, crumbling husk in the lukewarm water.
  It's already too late if you see one, just lay down and close your eyes. Never open them again.`;

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
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
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
        {/* Skin Stealer Section */}
        <Box sx={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          {/* Skin Stealer Image */}
          <Box
            sx={{
              width: 350,
              height: 320,
              minWidth: 350,
              backgroundImage: `url(${skinstealer})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={titleStyles}
            >
              The Skin Stealer
            </Typography>

            <Typography
              variant="body2"
              sx={descriptionStyles}
            >
              {skinStealerDescription}
            </Typography>
          </Box>
        </Box>

        {/* Glitchtons Section */}
        <Box sx={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          {/* Glitchtons Image */}
          <Box
            sx={{
              width: 350,
              height: 320,
              minWidth: 350,
              backgroundImage: `url(${glitchton})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={titleStyles}
            >
              Glitchtons
            </Typography>

            <Typography
              variant="body2"
              sx={descriptionStyles}
            >
              {glitchtonDescription}
            </Typography>
          </Box>
        </Box>

        {/* Weeping Angels Section */}
        <Box sx={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          {/* Weeping Angels Image */}
          <Box
            sx={{
              width: 350,
              height: 320,
              minWidth: 350,
              backgroundImage: `url(${weepingangel})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={titleStyles}
            >
              The Weeping Angels of the Still Water
            </Typography>

            <Typography
              variant="body2"
              sx={descriptionStyles}
            >
              {weepingAngelDescription}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
