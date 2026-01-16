import { useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, Box, Typography } from '@mui/material';
import backroomsImage from '../../assets/images/backrooms.jpg';
import megLogo from '../../assets/images/M.E.G logo.jpg';

export default function TheBackrooms() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const backroomsDescription = `If you're not careful and noclip out of reality in the wrong areas, you'll end up in the Backrooms, where it's nothing but the stink of old moist carpet, the madness of mono-yellow, the endless background noise of fluorescent lights at maximum hum-buzz, and approximately six hundred million square miles of randomly segmented empty rooms to be trapped in. God save you if you hear something wandering around nearby, because it sure as hell has heard you.`;

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        disableRipple
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
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
        The Backrooms
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            position: 'fixed',
            top: '70px',
            right: '20px',
            left: 'auto',
            maxWidth: 600,
            width: 'auto',
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
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: '#ffffffff',
                fontFamily: 'Verdana, sans-serif',
                fontSize: '12px',
                lineHeight: 1.6,
                textAlign: 'left',
                letterSpacing: '0.2px',
                marginBottom: '12px',
              }}
            >
              {backroomsDescription}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontFamily: 'Verdana, sans-serif',
                fontSize: '10px',
                textAlign: 'left',
                fontStyle: 'italic',
              }}
            >
              -Posted anonymous on imageboard in 4chan May 12, 2019.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <Box
              sx={{
                backgroundImage: `url(${backroomsImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '6px',
                width: 350,
                height: 250,
                minWidth: 300,
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                },
              }}
            />

            <Box
              sx={{
                backgroundImage: `url(${megLogo})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: 350,
                height: 150,
                minWidth: 300,
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
