import { useState } from 'react';
import { Button, Dialog, DialogContent, Box, Typography } from '@mui/material';
import megLogo from '../../assets/images/M.E.G logo.jpg';
import partygoerImage from '../../assets/images/partygoer.jpg';
import partypooperImage from '../../assets/images/partypooper.jpg';
import ImagePopup from './ImagePopup';

export default function PartyEntities() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const partygoerDescription = `Partygoers are tall, humanoid creatures with smooth leathery skin. 
  Their skin coloration varies with multiple colors, though yellow is the most common form of Partygoer. 
  The body of a Partygoer appears as a heavily modified humanoid, having a short stature and a lower body that does not 
  have legs.`;
  
  const partypooperDescription = `The Partypoopers, classified as Entity 68, are the empathetic and oppositional c
  ounterparts to the Раrtуgоеrѕ (Entity 67). Known for their friendly behavior and deep empathy for wanderers, 
  the Partypoopers are a stark contrast to the violent and manipulative nature of the Partygoers. 
  Despite their association with Entity 67 through a shared history, they are its complete antonym in behavior, 
  appearance, and purpose.`;

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        disableRipple
        sx={{
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#ffffffff',
          fontFamily: 'Verdana, sans-serif',
          fontSize: '12px',
          padding: '8px 16px',
          borderRadius: '20px',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          },
          border: '1px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        Party Goers and Party Poopers
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
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
          {/* Party Goer Section */}
          <Box>
            <Typography
              variant="h6"
              sx={titleStyles}
            >
              Party Goers (Entity 67)
            </Typography>
            
            {/* Party Goer Image */}
            <ImagePopup src={partygoerImage}>
              <Box
                sx={{
                  width: '100%',
                  height: 300,
                  backgroundImage: `url(${partygoerImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '6px',
                  marginBottom: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              />
            </ImagePopup>

            <Typography
              variant="body2"
              sx={descriptionStyles}
            >
              {partygoerDescription}
            </Typography>
          </Box>

          {/* Party Pooper Section */}
          <Box>
            <Typography
              variant="h6"
              sx={titleStyles}
            >
              Party Poopers (Entity 68)
            </Typography>
            
            {/* Party Pooper Image */}
            <ImagePopup src={partypooperImage}>
              <Box
                sx={{
                  width: '100%',
                  height: 300,
                  backgroundImage: `url(${partypooperImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '6px',
                  marginBottom: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              />
            </ImagePopup>

            <Typography
              variant="body2"
              sx={descriptionStyles}
            >
              {partypooperDescription}
            </Typography>
          </Box>

          {/* M.E.G Logo */}
          <ImagePopup src={megLogo}>
            <Box
              sx={{
                backgroundImage: `url(${megLogo})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100%',
                height: 150,
                marginTop: '12px',
              }}
            />
          </ImagePopup>
        </DialogContent>
      </Dialog>
    </>
  );
}
