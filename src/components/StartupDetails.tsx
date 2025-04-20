import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BugReportIcon from '@mui/icons-material/BugReport';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// ...importações mantidas como estão

export const StartupDetails: React.FC = () => {
  const { startupId } = useParams<{ startupId: string }>();
  const navigate = useNavigate();

  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/startups/${startupId}`);
        const data = await res.json();
        setStartup(data);
      } catch (err) {
        console.error('Erro ao carregar startup', err);
      } finally {
        setLoading(false);
      }
    };

    if (startupId) fetchStartup();
  }, [startupId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!startup) {
    return (
      <Box p={3}>
        <Typography variant="h5" color="error">Startup não encontrada</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 4, backgroundColor: 'rgba(255,255,255,0.9)', color: '#FF6B6B' }}
        >
          Voltar
        </Button>

        <Typography variant="h3" sx={{ color: 'white', mb: 4, fontWeight: 'bold' }}>
          Detalhes
        </Typography>

        <Grid container spacing={4}>
          {/* Info Principal */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#FF6B6B', fontWeight: 'bold' }}>
                  {startup.name}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 2 }}>
                  "{startup.slogan}"
                </Typography>
                <Typography variant="body1" paragraph>
                  Ano de Fundação: {startup.foundingYear}
                </Typography>
                <Typography variant="h6" gutterBottom>Descrição</Typography>
                <Typography variant="body1" paragraph>
                  {startup.description || 'Nenhuma descrição disponível'}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Estatísticas Atuais</Typography>
                <Grid container spacing={2}>
                  <Grid item><Chip icon={<RocketLaunchIcon />} label={`Pitches: ${startup.pitches}`} sx={{ backgroundColor: '#4CAF50', color: 'white' }} /></Grid>
                  <Grid item><Chip icon={<BugReportIcon />} label={`Bugs: ${startup.bugs}`} sx={{ backgroundColor: '#f44336', color: 'white' }} /></Grid>
                  <Grid item><Chip icon={<TrendingUpIcon />} label={`Tração: ${startup.tractions}`} sx={{ backgroundColor: '#2196f3', color: 'white' }} /></Grid>
                  <Grid item><Chip icon={<SentimentVeryDissatisfiedIcon />} label={`Investidor: ${startup.angryInvestors}`} sx={{ backgroundColor: '#ff9800', color: 'white' }} /></Grid>
                  <Grid item><Chip icon={<NewspaperIcon />} label={`Fake News: ${startup.fakeNews}`} sx={{ backgroundColor: '#9c27b0', color: 'white' }} /></Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Histórico */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Histórico de Participações
                </Typography>
                {startup.participations?.length > 0 ? (
                  startup.participations.map((p: any, index: number) => {
                    const isGold = p.finalPosition === 1;
                    const isSilver = p.finalPosition === 2;

                    return (
                      <Box
                        key={p.id}
                        sx={{
                          border: `1px solid ${isGold ? '#FFD700' : isSilver ? '#C0C0C0' : '#ddd'}`,
                          backgroundColor: isGold
                            ? 'rgba(255,215,0,0.1)'
                            : isSilver
                              ? 'rgba(192,192,192,0.1)'
                              : '#f9f9f9',
                          borderRadius: 2,
                          p: 2,
                          mb: 3,
                          transition: 'transform 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.02)',
                          }
                        }}
                      >
                        <Box display="flex" alignItems="center" mb={1}>
                          {isGold || isSilver ? (
                            <EmojiEventsIcon sx={{ color: isGold ? '#FFD700' : '#C0C0C0', mr: 1 }} />
                          ) : null}
                          <Typography variant="h6" fontWeight="bold">
                            Edição {index + 1} • {p.finalPosition}º lugar
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                          Participação em: {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                        </Typography>
                        <Typography variant="body1" mb={1}>
                          Pontuação: {p.finalScore}
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item><Chip size="small" icon={<RocketLaunchIcon />} label={`Pitches: ${p.finalPitches}`} /></Grid>
                          <Grid item><Chip size="small" icon={<BugReportIcon />} label={`Bugs: ${p.finalBugs}`} /></Grid>
                          <Grid item><Chip size="small" icon={<TrendingUpIcon />} label={`Tração: ${p.finalTractions}`} /></Grid>
                          <Grid item><Chip size="small" icon={<SentimentVeryDissatisfiedIcon />} label={`Investidores Irritados: ${p.finalAngryInvestors}`} /></Grid>
                          <Grid item><Chip size="small" icon={<NewspaperIcon />} label={`Fake News: ${p.finalFakeNews}`} /></Grid>
                        </Grid>
                      </Box>
                    );
                  })
                ) : (
                  <Typography align="center">Nenhuma participação anterior</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StartupDetails;
