import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden',
        position: 'relative',
        margin: 0,
        padding: 0,
      }}
    >
      <Container 
        maxWidth={false}
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          p: { xs: 2, sm: 4, md: 6 },
          position: 'relative',
          zIndex: 1,
          maxWidth: '1920px',
          margin: '0 auto',
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 4, md: 8 },
            height: '100%',
          }}
        >
          <Box 
            sx={{ 
              flex: 1,
              maxWidth: { xs: '100%', md: '50%' },
              textAlign: { xs: 'center', md: 'left' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ maxWidth: '600px', mx: { xs: 'auto', md: 0 } }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  fontWeight: 900,
                  mb: { xs: 2, md: 3 },
                  color: '#1a1a1a',
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                STARTUP
                <br />
                RUSH
              </Typography>
              
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  mb: 3,
                  color: '#666',
                  fontWeight: 500,
                }}
              >
                O torneio mais emocionante do ecossistema de startups!
              </Typography>

              <Typography
                sx={{
                  mb: 4,
                  color: '#666',
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  lineHeight: 1.6,
                }}
              >
                Startups com ideias inovadoras disputam entre si em rodadas sucessivas.
                Cada rodada representa um momento de avaliação, podendo ser influenciada
                por fatores positivos ou negativos simulados pelo sistema. O torneio
                acontece até que reste apenas uma vencedora, que será coroada como
                campeã do Startup Rush.
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                startIcon={<RocketLaunchIcon />}
                sx={{
                  backgroundColor: '#ff4d4d',
                  color: 'white',
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  padding: '12px 32px',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#ff3333',
                  },
                  boxShadow: '0 4px 6px rgba(255, 77, 77, 0.2)',
                }}
              >
                Começar o Torneio
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              position: 'relative',
            }}
          >
            <Box
              component="img"
              src="/startup-illustration.svg"
              alt="Startup Illustration"
              sx={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto',
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
              }}
            />
          </Box>
        </Box>
      </Container>

      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          backgroundColor: 'rgba(255, 77, 77, 0.03)',
          borderTopLeftRadius: '100px',
          display: { xs: 'none', md: 'block' },
        }}
      />
    </Box>
  );
}; 