import React from 'react';
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
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTournamentStore } from '../store/tournamentStore';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BugReportIcon from '@mui/icons-material/BugReport';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimelineIcon from '@mui/icons-material/Timeline';

const EventIcon = ({ eventType }: { eventType: string }) => {
  switch (eventType) {
    case 'PITCH':
      return <RocketLaunchIcon sx={{ color: '#4CAF50' }} />;
    case 'BUG':
      return <BugReportIcon sx={{ color: '#f44336' }} />;
    case 'TRACTION':
      return <TrendingUpIcon sx={{ color: '#2196f3' }} />;
    case 'ANGRY_INVESTOR':
      return <SentimentVeryDissatisfiedIcon sx={{ color: '#ff9800' }} />;
    case 'FAKE_NEWS':
      return <NewspaperIcon sx={{ color: '#9c27b0' }} />;
    default:
      return null;
  }
};

const RoundPhaseLabel = ({ phase }: { phase: 'FIRST_ROUND' | 'SEMI_FINAL' | 'FINAL' }) => {
  const labels: Record<'FIRST_ROUND' | 'SEMI_FINAL' | 'FINAL', string> = {
    'FIRST_ROUND': 'Primeira Fase',
    'SEMI_FINAL': 'Semi Final',
    'FINAL': 'Final'
  };
  return <Typography variant="caption">{labels[phase]}</Typography>;
};

export const StartupDetails: React.FC = () => {
  const { startupId } = useParams<{ startupId: string }>();
  const { tournament } = useTournamentStore();
  const navigate = useNavigate();

  const startup = tournament?.startups.find(s => s.id === startupId);

  if (!startup) {
    return (
      <Box p={3}>
        <Typography variant="h5" color="error">
          Startup não encontrada
        </Typography>
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
          sx={{
            mb: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: '#FF6B6B',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            }
          }}
        >
          Voltar
        </Button>

        <Typography
          variant="h3"
          component="h1"
          sx={{
            color: 'white',
            mb: 4,
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Detalhes
        </Typography>

        <Grid container spacing={4}>
          {/* Informações Principais */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom sx={{ color: '#FF6B6B', fontWeight: 'bold' }}>
                  {startup.name}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3, fontStyle: 'italic' }}>
                  "{startup.slogan}"
                </Typography>
                
                <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
                  Ano de Fundação: {startup.foundingYear}
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
                  Descrição
                </Typography>
                <Typography variant="body1" paragraph>
                  {startup.description || "Nenhuma descrição disponível"}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Estatísticas Atuais
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item>
                    <Chip
                      icon={<RocketLaunchIcon />}
                      label={`Pitches: ${startup.stats.pitches}`}
                      sx={{ backgroundColor: '#4CAF50', color: 'white' }}
                    />
                  </Grid>
                  <Grid item>
                    <Chip
                      icon={<BugReportIcon />}
                      label={`Bugs: ${startup.stats.bugs}`}
                      sx={{ backgroundColor: '#f44336', color: 'white' }}
                    />
                  </Grid>
                  <Grid item>
                    <Chip
                      icon={<TrendingUpIcon />}
                      label={`Tração: ${startup.stats.tractions}`}
                      sx={{ backgroundColor: '#2196f3', color: 'white' }}
                    />
                  </Grid>
                  <Grid item>
                    <Chip
                      icon={<SentimentVeryDissatisfiedIcon />}
                      label={`Investidor Irritado: ${startup.stats.angryInvestors}`}
                      sx={{ backgroundColor: '#ff9800', color: 'white' }}
                    />
                  </Grid>
                  <Grid item>
                    <Chip
                      icon={<NewspaperIcon />}
                      label={`Fake News: ${startup.stats.fakeNews}`}
                      sx={{ backgroundColor: '#9c27b0', color: 'white' }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Histórico de Participações */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  Histórico de Participações
                </Typography>
                
                {startup.participationHistory && startup.participationHistory.length > 0 ? (
                  startup.participationHistory.map((participation) => (
                    <Box
                      key={participation.edition}
                      sx={{
                        mb: 4,
                        p: 3,
                        backgroundColor: participation.position === 1 ? 'rgba(255, 215, 0, 0.1)' : 'rgba(192, 192, 192, 0.1)',
                        borderRadius: 2,
                        border: `1px solid ${participation.position === 1 ? '#FFD700' : '#C0C0C0'}`
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EmojiEventsIcon 
                          sx={{ 
                            fontSize: 40,
                            mr: 2,
                            color: participation.position === 1 ? '#FFD700' : '#C0C0C0'
                          }}
                        />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Edição {participation.edition}
                          </Typography>
                          <Typography 
                            variant="subtitle1"
                            sx={{
                              color: participation.position === 1 ? '#FFD700' : '#808080',
                              fontWeight: 'bold'
                            }}
                          >
                            {participation.position}º lugar • Pontuação Final: {participation.score}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Estatísticas Finais */}
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Estatísticas Finais
                      </Typography>
                      <Grid container spacing={1} sx={{ mb: 2 }}>
                        <Grid item>
                          <Chip
                            size="small"
                            icon={<RocketLaunchIcon />}
                            label={`${participation.finalPitches} Pitches`}
                            sx={{ backgroundColor: '#4CAF50', color: 'white' }}
                          />
                        </Grid>
                        <Grid item>
                          <Chip
                            size="small"
                            icon={<BugReportIcon />}
                            label={`${participation.finalBugs} Bugs`}
                            sx={{ backgroundColor: '#f44336', color: 'white' }}
                          />
                        </Grid>
                        <Grid item>
                          <Chip
                            size="small"
                            icon={<TrendingUpIcon />}
                            label={`${participation.finalTractions} Trações`}
                            sx={{ backgroundColor: '#2196f3', color: 'white' }}
                          />
                        </Grid>
                        <Grid item>
                          <Chip
                            size="small"
                            icon={<SentimentVeryDissatisfiedIcon />}
                            label={`${participation.finalAngryInvestors} Investidores Irritados`}
                            sx={{ backgroundColor: '#ff9800', color: 'white' }}
                          />
                        </Grid>
                        <Grid item>
                          <Chip
                            size="small"
                            icon={<NewspaperIcon />}
                            label={`${participation.finalFakeNews} Fake News`}
                            sx={{ backgroundColor: '#9c27b0', color: 'white' }}
                          />
                        </Grid>
                      </Grid>

                      {/* Timeline de Eventos */}
                      {participation.events && participation.events.length > 0 && (
                        <>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Eventos Durante o Torneio
                          </Typography>
                          <Box sx={{ ml: 2 }}>
                            {participation.events.map((event, index) => (
                              <Box
                                key={index}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  mb: 1,
                                  p: 1,
                                  borderLeft: '2px solid #ccc'
                                }}
                              >
                                <Box sx={{ mr: 2 }}>
                                  <EventIcon eventType={event.eventType} />
                                </Box>
                                <Box>
                                  <RoundPhaseLabel phase={event.roundPhase} />
                                  <Typography variant="body2">
                                    {event.description}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1" color="text.secondary" align="center">
                    Nenhuma participação anterior
                  </Typography>
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