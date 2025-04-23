import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTournamentStore } from '../store/tournamentStore';
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
  TextField,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BugReportIcon from '@mui/icons-material/BugReport';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import HistoryIcon from '@mui/icons-material/History';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export const StartupDetails: React.FC = () => {
  const { startupId } = useParams<{ startupId: string }>();
  const navigate = useNavigate();
  const { tournament } = useTournamentStore();
  const [history, setHistory] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedSlogan, setEditedSlogan] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [localStartup, setLocalStartup] = useState<any>(null);
  const { updateStartup } = useTournamentStore(); 
  const startup = localStartup || tournament?.startups.find(s => s.id === startupId);

  useEffect(() => {
    if (startup) {
      setEditedName(startup.name);
      setEditedSlogan(startup.slogan);
      setEditedDescription(startup.description || '');
      setLocalStartup(startup);
    }
  }, [startup]);

  useEffect(() => {
    if (!startupId) return;

    fetch(`http://localhost:3001/api/startups/${startupId}/participations`)
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error("Erro ao carregar histórico:", err));
  }, [startupId]);

  const handleSave = async () => {
    if (!startupId) return;
  
    try {
      const response = await fetch(`http://localhost:3001/api/startups/${startupId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedName,
          slogan: editedSlogan,
          description: editedDescription,
        }),
      });
  
      if (!response.ok) {
        console.error('Erro ao atualizar startup');
        return;
      }
  
      const updatedStartup = await response.json();
  
      // ✅ Preserva o stats da versão antiga
      const currentStats = startup?.stats;
  
      const fullStartupWithStats = {
        ...updatedStartup,
        stats: currentStats, // ← preserva os dados visíveis no front
      };
  
      setLocalStartup(fullStartupWithStats);
  
      // ✅ Atualiza também o store
      const updateInStore = useTournamentStore.getState().setTournament;
      const currentTournament = useTournamentStore.getState().tournament;
  
      if (currentTournament) {
        const updatedStartups = currentTournament.startups.map(s =>
          s.id === updatedStartup.id ? fullStartupWithStats : s
        );
  
        updateInStore({ ...currentTournament, startups: updatedStartups });
      }
  
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
    }
  };
  
  
  const handleCancel = () => {
    if (startup) {
      setEditedName(startup.name);
      setEditedSlogan(startup.slogan);
      setEditedDescription(startup.description || '');
    }
    setIsEditing(false);
  };

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
        return <EmojiEventsIcon />;
      case 3:
        return <EmojiEventsIcon />;
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
        {/* Botão Voltar e Editar */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
          
          {isEditing ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleSave}
                startIcon={<SaveIcon />}
                sx={{ 
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                  color: 'white',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #45a049 0%, #4CAF50 100%)',
                  }
                }}
              >
                Salvar
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                startIcon={<CancelIcon />}
                sx={{ 
                  color: '#FF6B6B',
                  borderColor: '#FF6B6B',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#FF8E53',
                    color: '#FF8E53',
                  }
                }}
              >
                Cancelar
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={() => setIsEditing(true)}
              startIcon={<EditIcon />}
              sx={{ 
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                color: 'white',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)',
                }
              }}
            >
              Editar
            </Button>
          )}
        </Box>

        {/* Cabeçalho da Startup */}
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    sx={{ 
                      mb: 2,
                      '& .MuiInputBase-input': {
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 900,
                        fontSize: '2rem',
                        color: '#FF6B6B'
                      }
                    }}
                  />
                ) : (
                  <Typography variant="h3" sx={{ color: '#FF6B6B', fontWeight: 900 }}>
                    {startup.name}
                  </Typography>
                )}
                
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={editedSlogan}
                    onChange={(e) => setEditedSlogan(e.target.value)}
                    sx={{ 
                      '& .MuiInputBase-input': {
                        fontFamily: "'Inter', sans-serif",
                        fontStyle: 'italic',
                        color: 'text.secondary'
                      }
                    }}
                  />
                ) : (
                  <Typography variant="h6" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    "{startup.slogan}"
                  </Typography>
                )}

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
                {isEditing ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    sx={{ 
                      mt: 1,
                      '& .MuiInputBase-input': {
                        fontFamily: "'Inter', sans-serif"
                      }
                    }}
                  />
                ) : (
                  <Typography variant="body2">
                    {startup.description || "Nenhuma descrição disponível."}
                  </Typography>
                )}
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
                        border: '2px solid',
                        borderColor: entry.finalPosition === 1 ? '#FFD700' :
                                   entry.finalPosition === 2 ? '#C0C0C0' :
                                   entry.finalPosition === 3 ? '#CD7F32' : '#FF6B6B',
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
                          border: '2px solid',
                          borderColor: entry.finalPosition === 1 ? '#FFD700' :
                                     entry.finalPosition === 2 ? '#C0C0C0' :
                                     entry.finalPosition === 3 ? '#CD7F32' : '#FF6B6B',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <EmojiEventsIcon sx={{ 
                          color: entry.finalPosition === 1 ? '#FFD700' :
                                 entry.finalPosition === 2 ? '#C0C0C0' :
                                 entry.finalPosition === 3 ? '#CD7F32' : '#FF6B6B'
                        }} />
                        <Typography sx={{ 
                          color: entry.finalPosition === 1 ? '#FFD700' :
                                 entry.finalPosition === 2 ? '#C0C0C0' :
                                 entry.finalPosition === 3 ? '#CD7F32' : '#FF6B6B',
                          fontWeight: 700 
                        }}>
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
