import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
} from '@mui/material';
import { useTournamentStore } from '../store/tournamentStore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BugReportIcon from '@mui/icons-material/BugReport';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import HistoryIcon from '@mui/icons-material/History';
import StarIcon from '@mui/icons-material/Star';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import InfoIcon from '@mui/icons-material/Info';

export const StartupDetails: React.FC = () => {
  const { startupId } = useParams<{ startupId: string }>();
  const navigate = useNavigate();
  const { tournament } = useTournamentStore();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!startupId) return;

    fetch(`http://localhost:3001/api/startups/${startupId}/participations`)
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error("Erro ao carregar histórico:", err));
  }, [startupId]);

  const startup = tournament?.startups.find(s => s.id === startupId);

  if (!startup) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#FF6B6B', 
            textAlign: 'center', 
            mb: 2,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600
          }}
        >
          Startup não encontrada
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ 
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
            color: 'white',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)',
            }
          }}
        >
          Voltar para o Início
        </Button>
      </Box>
    );
  }

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return '#FF6B6B';
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <EmojiEventsIcon />;
      case 2:
        return <MilitaryTechIcon />;
      case 3:
        return <StarIcon />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Botão Voltar */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ 
              color: '#FF6B6B',
              '&:hover': { color: '#FF8E53' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            sx={{ 
              ml: 1,
              color: '#FF6B6B',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600
            }}
          >
            Voltar
          </Typography>
        </Box>

        {/* Cabeçalho da Startup */}
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h3" sx={{ color: '#FF6B6B', fontWeight: 900 }}>{startup.name}</Typography>
                <Typography variant="h6" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                  "{startup.slogan}"
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  <Chip icon={<RocketLaunchIcon />} label={`${startup.stats.pitches} Pitches`} />
                  <Chip icon={<BugReportIcon />} label={`${startup.stats.bugs} Bugs`} />
                  <Chip icon={<TrendingUpIcon />} label={`${startup.stats.tractions} Trações`} />
                  <Chip icon={<SentimentVeryDissatisfiedIcon />} label={`${startup.stats.angryInvestors} Investidores`} />
                  <Chip icon={<NewspaperIcon />} label={`${startup.stats.fakeNews} Fake News`} />
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h4" sx={{ color: '#FF6B6B', fontWeight: 900 }}>
                  {startup.score} pts
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Detalhes */}
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ color: '#FF6B6B', fontWeight: 900, mb: 2 }}>
              <InfoIcon /> Detalhes da Startup
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" color="text.secondary">Ano de Fundação</Typography>
                <Typography variant="h6">{startup.foundingYear}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary">Descrição</Typography>
                <Typography variant="body2">
                  {startup.description || "Nenhuma descrição disponível."}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Histórico */}
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ color: '#FF6B6B', fontWeight: 900, mb: 2 }}>
              <HistoryIcon /> Histórico de Participações
            </Typography>

            {history.length > 0 ? (
              <Grid container spacing={3}>
                {history.map((entry, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 107, 107, 0.04)',
                        border: `2px solid ${getPositionColor(entry.finalPosition)}`,
                        position: 'relative'
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -15,
                          left: 20,
                          backgroundColor: 'white',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          border: `2px solid ${getPositionColor(entry.finalPosition)}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        {getPositionIcon(entry.finalPosition)}
                        <Typography sx={{ color: getPositionColor(entry.finalPosition), fontWeight: 700 }}>
                          Edição #{entry.tournamentId.slice(0, 5)}
                        </Typography>
                      </Box>

                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6}>
                          <Typography color="text.secondary">Posição Final</Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            {entry.finalPosition}º lugar
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography color="text.secondary">Pontuação Final</Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            {entry.finalScore} pontos
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                          <Typography color="text.secondary" sx={{ mb: 1 }}>Estatísticas Finais</Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip icon={<RocketLaunchIcon />} label={`${entry.finalPitches} Pitches`} />
                            <Chip icon={<BugReportIcon />} label={`${entry.finalBugs} Bugs`} />
                            <Chip icon={<TrendingUpIcon />} label={`${entry.finalTractions} Trações`} />
                            <Chip icon={<SentimentVeryDissatisfiedIcon />} label={`${entry.finalAngryInvestors} Investidores Irritados`} />
                            <Chip icon={<NewspaperIcon />} label={`${entry.finalFakeNews} Fake News`} />
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                Esta startup ainda não participou de nenhum torneio anterior.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default StartupDetails;
