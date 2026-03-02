import { useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, Box, Typography } from '@mui/material';
import megImage from '../../assets/images/megpersonel.png';
import megLogo from '../../assets/images/M.E.G logo.jpg';
import ImagePopup from './ImagePopup';

export default function MEG() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const megDescription = `The M.E.G. (a.k.a. The "Major Explorer Group") is a group created by the people of the Backrooms. The group started out as an exploration outpost in 2012, but it grew to become an exploration group by 2014. The M.E.G. tries to keep wanderers safe from entities, traps, and other groups such as The Insurrection, which they are at war with for territory of levels like Level 3. To ensure the safety of the wanderers, the M.E.G. maintains multiple teams for different purposes. This faction is extremely friendly and will allow new members into a team known as the "Volunteer Squad" until they are ready to be in a team of their own.`;

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
        M.E.G
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
        <DialogTitle
          sx={{
            color: '#ffffffff',
            fontFamily: 'Verdana, sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            textAlign: 'center',
            padding: '16px 20px 12px 20px',
          }}
        >
          Who are the M.E.G.?
        </DialogTitle>

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
              }}
            >
              {megDescription}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <ImagePopup src={megImage}>
              <Box
                sx={{
                  backgroundImage: `url(${megImage})`,
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
            </ImagePopup>

            <ImagePopup src={megLogo}>
              <Box
                sx={{
                  backgroundImage: `url(${megLogo})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  width: 350,
                  height: 169,
                  minWidth: 300,
                }}
              />
            </ImagePopup>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
