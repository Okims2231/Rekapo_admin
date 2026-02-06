import { Dialog, DialogContent, Box, Typography } from '@mui/material';
import heavenEntity from '../../assets/images/heaven entity.png';
import noonEffigy from '../../assets/images/The Noon Effigy.jpg';
import penumbraPatient from '../../assets/images/The Penumbra Patent.png';

export default function BeastOfLevelHeaven({ onClose }) {
  const descriptionStyles = {
    color: '#ffffffff',
    fontFamily: 'Verdana, sans-serif',
    fontSize: '13px',
    lineHeight: 1.8,
    textAlign: 'left',
    letterSpacing: '0.3px',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
  };

  const titleStyles = {
    color: '#ffffffff',
    fontFamily: 'Verdana, sans-serif',
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '12px',
    textAlign: 'left',
    textShadow: '0 2px 4px rgba(0,0,0,0.6)',
  };

  const aetherWalkerDescription = `Standing approximately 30 meters tall, The Aether-Walker is a massive, pale, and skeletal quadruped that wanders the horizon in a slow, silent loop. Though it lacks facial features, its head tracks wanderers with unsettling precision, usually remaining docile and abstaining from biological needs like eating or sleeping. However, should a wanderer damage the cloud floor or create excessive noise, the sky instantly shifts to a violent grey as the entity manifests directly behind the offender. Rather than attacking physically, it radiates an overwhelming psychic pressure described as "religious dread," forcing victims to kneel and weep until they succumb to exhaustion.`;

  const noonEffigyDescription = `This entity is the physical embodiment of "over-reality." It appears when the sun is at its absolute zenith and shadows have completely disappeared, creating a flat, uncanny look to the world. The Noon Effigy is not a biological creature, but a towering solidification of heat haze and static. The object it holds—resembling a sword—is actually a "Reality Anchor," a tuning fork that emits a low-frequency hum audible only to those suffering from heatstroke or dehydration. Witnesses do not feel fear; instead, they experience "Psychic Sunburn"—an agonizing, hyper-aware state where they can feel every individual hair on their body and hear the blood rushing in their ears. It represents the terror of being completely exposed, with nowhere to hide.`;

  const penumbraPatientDescription = `In direct contrast, the Penumbra Patient is an entity of subtraction. She manifests during that brief, confusing window of twilight when streetlights haven't turned on yet, but the sun is gone. She appears as a smudge on the lens of the world—a silhouette that looks like a 19th-century mourning dress made of heavy smoke. She does not actively hunt; she simply stands in the peripheral vision of solitary travelers. Being near her triggers acute Jamais Vu—the sudden, terrifying feeling that your familiar surroundings are completely alien. She feeds on the specific melancholy of forgotten childhood memories. If you walk deeply into her mist, you don't die; you simply become a "background character" in your own life, fading until you are as silent and gray as she is.`;

  return (
    <Dialog
      open={true}
      onClose={onClose}
      PaperProps={{
        sx: {
          position: 'fixed',
          top: '70px',
          left: '20px',
          right: 'auto',
          maxWidth: 750,
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
          gap: '30px',
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
        {/* Title */}
        <h2 style={{ ...titleStyles, fontSize: '20px', marginBottom: '20px', color: '#ffccccff' }}>
          Level Heaven Entities
        </h2>

        {/* Aether-Walker Section */}
        <Box sx={{ paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 300,
                  height: 400,
                  minWidth: 300,
                  backgroundImage: `url(${heavenEntity})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                }}
              />
            </Box>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={titleStyles}>The Aether-Walker</h3>
              <Typography sx={descriptionStyles}>
                {aetherWalkerDescription}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Noon Effigy Section */}
        <Box sx={{ paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 300,
                  height: 400,
                  minWidth: 300,
                  backgroundImage: `url(${noonEffigy})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                }}
              />
            </Box>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={titleStyles}>The Noon Effigy</h3>
              <Typography sx={descriptionStyles}>
                {noonEffigyDescription}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Penumbra Patient Section */}
        <Box>
          <Box sx={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 300,
                  height: 400,
                  minWidth: 300,
                  backgroundImage: `url(${penumbraPatient})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                }}
              />
            </Box>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={titleStyles}>The Penumbra Patient</h3>
              <Typography sx={descriptionStyles}>
                {penumbraPatientDescription}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
