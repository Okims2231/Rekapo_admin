import { Button, Dialog, DialogContent, Box, Typography } from '@mui/material';
import lvl94aImage from '../../assets/images/lvl 94a.png';
import lvl94bImage from '../../assets/images/lvl 94b.png';
import lvl94cImage from '../../assets/images/lvl 94c.png';
import megLogo from '../../assets/images/M.E.G logo.jpg';

export default function Level94({ isOpen, onClose }) {
  const descriptionStyles = {
    color: '#ffffffff',
    fontFamily: 'Verdana, sans-serif',
    fontSize: '13px',
    lineHeight: 1.9,
    textAlign: 'left',
    letterSpacing: '0.3px',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    textShadow: '0 1px 3px rgba(0,0,0,0.6)',
  };

  const titleStyles = {
    color: '#ffffffff',
    fontFamily: 'Verdana, sans-serif',
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '16px',
    textAlign: 'left',
    textShadow: '0 2px 5px rgba(0,0,0,0.7)',
  };

  const level94Description = `Level 94 appears to be a large town, a floating castle and grass hills, but everything has a grainy effect, as if this place was crafted. The main town is safe, with no Entities during the day.

This Town has a big water fountain in the center, flowing with Almond Water. This town seems to be in the 1930's, in a stop-motion type feel. This town has tiny houses, with some furniture, mostly in 1930's to 1950's. The town also has 1930's styled cars, and milk vans, filled with Almond Milk. The town also has siren poles, which time to time, play happy cartoony music. At this time, everything is safe, until it turns night, the music will stop completely, and at this time the Entity known as Animations will start to appear, and will attack violently, if spotted.

The grass hills of Level 94 usually go on forever, and is infinite, the only thing there, are a few strange cars parked in the middle of nowhere, and a water tower. Which seems to contain Almond Water. What is strange about the hills, is that random sets of furniture and even entire single rooms of a house can be found, or sometimes it's just a wall with furniture.`;

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          position: 'fixed',
          top: '70px',
          right: '20px',
          left: 'auto',
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
          flexDirection: 'row',
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
        {/* Text Section */}
        <Box sx={{ flex: '0 0 45%', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '100%' }}>
          <Typography
            variant="h5"
            sx={titleStyles}
          >
            Level 94
          </Typography>

          <Typography
            variant="body2"
            sx={descriptionStyles}
          >
            {level94Description}
          </Typography>
        </Box>

        {/* Images Section */}
        <Box sx={{ flex: '0 0 55%', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: '100%', paddingRight: '10px' }}>
          <Box
            sx={{
              width: '100%',
              height: 208,
              backgroundImage: `url(${lvl94aImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              flexShrink: 0,
            }}
          />

          <Box
            sx={{
              width: '100%',
              height: 208,
              backgroundImage: `url(${lvl94bImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              flexShrink: 0,
            }}
          />

          <Box
            sx={{
              width: '100%',
              height: 208,
              backgroundImage: `url(${lvl94cImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              flexShrink: 0,
            }}
          />

          <Box
            sx={{
              width: '100%',
              height: 120,
              backgroundImage: `url(${megLogo})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '6px',
              flexShrink: 0,
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
