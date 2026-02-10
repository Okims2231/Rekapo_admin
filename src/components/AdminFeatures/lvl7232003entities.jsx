import { Dialog, DialogContent, Box, Typography } from '@mui/material';
import astronautSwimmersGif from '../../assets/images/astronaut swimmer.gif';
import astralForgerImg from '../../assets/images/astral forger.jpg';
import parallaxShepherdImg from '../../assets/images/astral brine.jpg';

export default function Lvl7232003Entities({ isOpen, onClose }) {
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

  const astronautSwimmersLore = `Astronaut Swimmers are benevolent entities resembling human astronauts in unmarked EVA style suits who drift effortlessly through the Astral Brine, often appearing near lost, injured, or panicked wanderers. They do not speak or gesture, yet their presence induces calm and clarity, and they are known to guide wanderers away from unstable regions or toward potential exits. Attempts to interfere with or remove their helmets have universally failed and resulted in spatial distortions, leading many to believe these entities are either preserved former wanderers or autonomous manifestations of the level itself acting as caretakers.`;

  const astralForgerLore = `The Astral Forger is a colossal cosmic entity resembling a humanoid blacksmith formed from condensed starlight, fractured metal, and slowly rotating nebular matter, most often encountered near regions where the Astral Brine solidifies into anvil like platforms. The entity is neutral and rarely acknowledges wanderers, but those who remain calm, patient, and non-hostile may earn its attention, at which point it will silently offer to craft either a single piece of armor or a single weapon never both using materials drawn directly from the level itself.`;

  const parallaxShepherdLore = `The Parallax Shepherd is a towering, semi translucent humanoid entity with elongated, distorted limbs, a faceless head emitting faint blue light, and a glowing golden core embedded in its lower torso, around which several small planet like spheres orbit. Usually passive, it appears to manipulate the structure of the level by stabilizing or dissolving regions of Astral Brine, but becomes hostile if its core, orbiting spheres, or nearby Astronaut Swimmers are disturbed. Rather than attacking directly, the entity forcibly alters space itself, expelling affected wanderers to unknown levels, leading researchers to theorize that the Parallax Shepherd functions as a living warden or anchor maintaining the balance of Level 7,232,003.`;

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
        {/* Astronaut Swimmers Section */}
        <Box sx={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={titleStyles}
            >
              Astronaut Swimmers
            </Typography>

            <Typography
              variant="body2"
              sx={descriptionStyles}
            >
              {astronautSwimmersLore}
            </Typography>
          </Box>

          {/* Astronaut Swimmers Image */}
          <Box
            sx={{
              width: 350,
              height: 340,
              minWidth: 350,
              backgroundImage: `url(${astronautSwimmersGif})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />
        </Box>

        {/* Astral Forger Section */}
        <Box sx={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={titleStyles}
            >
              Astral Forger
            </Typography>

            <Typography
              variant="body2"
              sx={descriptionStyles}
            >
              {astralForgerLore}
            </Typography>
          </Box>

          {/* Astral Forger Image */}
          <Box
            sx={{
              width: 350,
              height: 320,
              minWidth: 350,
              backgroundImage: `url(${astralForgerImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />
        </Box>

        {/* Parallax Shepherd Section */}
        <Box sx={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={titleStyles}
            >
              The Parallax Shepherd
            </Typography>

            <Typography
              variant="body2"
              sx={descriptionStyles}
            >
              {parallaxShepherdLore}
            </Typography>
          </Box>

          {/* Parallax Shepherd Image */}
          <Box
            sx={{
              width: 350,
              height: 400,
              minWidth: 350,
              backgroundImage: `url(${parallaxShepherdImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
