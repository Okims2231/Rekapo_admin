import { useState } from 'react';
import { Button, Dialog, DialogContent, Box, Typography } from '@mui/material';
import levelFunImage1 from '../../assets/images/lvlfunbtn.jpg';
import levelFunImage3 from '../../assets/images/lvlfunbtn3.jpg';
import levelFunImage2 from '../../assets/images/lvlfunbtn2.jpg';
import megLogo from '../../assets/images/M.E.G logo.jpg';

export default function LevelFun() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const levelFunDescription = ` Level Fun is a spacious warehouse containing a vast amount of inflatable bounce houses. The only visible walls are those along the entrance, as the rest of the interior is entirely obscured by the numerous inflatables, with some of the largest nearly reaching the metal trusses on the ceiling. Upon entering the level, if one even briefly breaks line-of-sight with the entrance, the doors and walls will vanish, with the unending series of inflatables simply continuing on in their place. The constant drone of inflating air and overhead lights can be heard echoing throughout the entirety of Level Fun, with the frigid air-conditioning causing one goosebumps every so often. Extension cords cover the faded, retro carpeting in snakelike formations, stretching out in all directions to supply power to each inflatable. Different colors, themes, and designs make up the numerous bounce houses placed side-by-side across the level; the scratchy, uncomfortable feeling of thin-carpet-on-concrete tends to drive wanderers to enter one, if only to find relief from the floor's insufficient padding.`;

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
        Level Fun
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
              }}
            >
              {levelFunDescription}
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
                backgroundImage: `url(${levelFunImage1})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '6px',
                width: 350,
                height: 200,
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
                backgroundImage: `url(${levelFunImage3})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '6px',
                width: 350,
                height: 200,
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
                backgroundImage: `url(${levelFunImage2})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '6px',
                width: 350,
                height: 200,
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
