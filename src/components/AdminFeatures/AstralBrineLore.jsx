import { Dialog, DialogContent, Box, Typography } from '@mui/material';
import ImagePopup from './ImagePopup';
import nebulaImg1 from '../../assets/images/lvl nebula1.jpg';
import nebulaImg2 from '../../assets/images/lvl nebula2.jpg';
import nebulaImg3 from '../../assets/images/lvl nebula3.jpg';

export default function AstralBrineLore({ isOpen, onClose }) {
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

  const lore = `Level 7,232,003 is a vast cosmic expanse resembling a fractured nebula filled with swirling magenta, violet, and deep-blue clouds, interspersed with star-like lights that do not correspond to any known constellations. Large areas of the level are composed of a luminous liquid known as Astral Brine, which behaves like water but makes drowning impossible, allowing wanderers to breathe freely regardless of depth. Gravity is inconsistent and appears to shift based on movement and intent rather than physical laws, while prolonged exposure may cause disorientation, false memories, and a sensation of drifting through time, though the level itself remains largely stable and non-hostile. Occasional ripples in the Astral Brine reveal fleeting reflections of unknown worlds, some of which persist long enough to suggest failed or incomplete exits.Soft, distant vibrations can sometimes be felt through the Brine, resembling the echo of massive objects moving far beyond visible space. Astronaut Swimmers are frequently observed near these disturbances, suggesting they may act as stabilizing agents or guides when the level subtly shifts. Wanderers who attempt to follow the reflections too closely often find distance folding in on itself, returning them to their original position after extended periods of travel.`;

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
          gap: '20px',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
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
        {/* Left: Title and Lore Text */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            sx={{
              color: '#ffffffff',
              fontFamily: 'Verdana, sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              marginBottom: '12px',
              textalign: 'left',
            }}
          >
            Level 7,232,003 – The Astral Brine
          </Typography>

          <Typography
            variant="body2"
            sx={descriptionStyles}
          >
            {lore}
          </Typography>
        </Box>

        {/* Right: Images Stacked Vertically */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Image 1 */}
          <ImagePopup src={nebulaImg1}>
            <Box
              sx={{
                width: '350px',
                height: '200px',
                minWidth: '350px',
                backgroundImage: `url(${nebulaImg1})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            />
          </ImagePopup>

          {/* Image 2 */}
          <ImagePopup src={nebulaImg2}>
            <Box
              sx={{
                width: '350px',
                height: '200px',
                minWidth: '350px',
                backgroundImage: `url(${nebulaImg2})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            />
          </ImagePopup>

          {/* Image 3 */}
          <ImagePopup src={nebulaImg3}>
            <Box
              sx={{
                width: '350px',
                height: '200px',
                minWidth: '350px',
                backgroundImage: `url(${nebulaImg3})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            />
          </ImagePopup>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
