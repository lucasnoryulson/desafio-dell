import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Container,
  IconButton,
  Tooltip
} from '@mui/material';
import { useTournamentStore } from '../store/tournamentStore';
import { Battle as BattleType, EventType, Startup, BattleEvent } from '../types';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BugReportIcon from '@mui/icons-material/BugReport';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssessmentIcon from '@mui/icons-material/Assessment';

type StartupStats = {
  pitches: number;
  bugs: number;
  tractions: number;
  angryInvestors: number;
  fakeNews: number;
};

// Consolidated constant declarations
const EventTypeConfig = {
  icons: {
    'PITCH': <RocketLaunchIcon />,
    'BUG': <BugReportIcon />,
    'TRACTION': <TrendingUpIcon />,
    'ANGRY_INVESTOR': <SentimentVeryDissatisfiedIcon />,
    'FAKE_NEWS': <NewspaperIcon />
  },
  labels: {
    'PITCH': 'Pitch',
    'BUG': 'Bug',
    'TRACTION': 'Tração',
    'ANGRY_INVESTOR': 'Investidor Irritado',
    'FAKE_NEWS': 'Fake News'
  },
  colors: {
    'PITCH': '#4CAF50',
    'BUG': '#f44336',
    'TRACTION': '#2196f3',
    'ANGRY_INVESTOR': '#ff9800',
    'FAKE_NEWS': '#9c27b0'
  },
  points: {
    'PITCH': 6,
    'BUG': -4,
    'TRACTION': 3,
    'ANGRY_INVESTOR': -6,
    'FAKE_NEWS': -8
  },
  mapping: {
    'PITCH': 'pitches',
    'BUG': 'bugs',
    'TRACTION': 'tractions',
    'ANGRY_INVESTOR': 'angryInvestors',
    'FAKE_NEWS': 'fakeNews'
  } as Record<EventType, keyof StartupStats>
};

export default function Battle() {
  const { battleId } = useParams<{ battleId: string }>();
  const navigate = useNavigate();
  const {
    tournament,
    getStartupById,
    completeBattle,
    addEvent,
  } = useTournamentStore();

  const [battle, setBattle] = useState<BattleType | null>(null);
  const [startup1, setStartup1] = useState<Startup | null>(null);
  const [startup2, setStartup2] = useState<Startup | null>(null);
  const [selectedStartup, setSelectedStartup] = useState<string | null>(null);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [eventCounts, setEventCounts] = useState<Record<number, Record<string, Record<EventType, number>>>>({});
  const [showSharkFight, setShowSharkFight] = useState(false);

  useEffect(() => {
    if (!battleId || !tournament) return;

    const currentBattle = tournament.battles.find(b => b.id === battleId);
    if (!currentBattle) return;

    setBattle(currentBattle);
    setStartup1(currentBattle.startup1);
    setStartup2(currentBattle.startup2);
    setShowSharkFight(false);
    
    // Initialize event counts for the current round if not already initialized
    setEventCounts(prev => {
      if (!prev[currentBattle.round]) {
        return {
          ...prev,
          [currentBattle.round]: {
            [currentBattle.startup1.id]: {
              'PITCH': 0,
              'BUG': 0,
              'TRACTION': 0,
              'ANGRY_INVESTOR': 0,
              'FAKE_NEWS': 0
            },
            [currentBattle.startup2.id]: {
              'PITCH': 0,
              'BUG': 0,
              'TRACTION': 0,
              'ANGRY_INVESTOR': 0,
              'FAKE_NEWS': 0
            }
          }
        };
      }
      return prev;
    });

    // Update event counts from battle events
    if (Array.isArray(currentBattle.events) && currentBattle.events.length > 0) {
      currentBattle.events.forEach(event => {
        setEventCounts(prev => ({
          ...prev,
          [currentBattle.round]: {
            ...prev[currentBattle.round],
            [event.startupId]: {
              ...prev[currentBattle.round][event.startupId],
              [event.type]: prev[currentBattle.round][event.startupId][event.type] + 1
            }
          }
        }));
      });
    }
  }, [battleId, tournament]);

  // Efeito para atualizar os estados locais quando o torneio mudar
  useEffect(() => {
    if (!tournament || !battle) return;
    
    const updatedStartup1 = tournament.startups.find(s => s.id === startup1?.id);
    const updatedStartup2 = tournament.startups.find(s => s.id === startup2?.id);
    
    if (updatedStartup1) setStartup1(updatedStartup1);
    if (updatedStartup2) setStartup2(updatedStartup2);
  }, [tournament, battle]);

  const handleEventSelect = (eventType: EventType) => {
    if (!selectedStartup || !battle) return;

    // Adiciona o evento
    addEvent(battle.id, selectedStartup, eventType);
    
    // Atualiza o contador de eventos
    setEventCounts(prev => ({
      ...prev,
      [battle.round]: {
        ...prev[battle.round],
        [selectedStartup]: {
          ...prev[battle.round]?.[selectedStartup],
          [eventType]: 1
        }
      }
    }));
    
    // Atualiza os estados locais com as novas pontuações
    if (tournament) {
      const updatedStartup1 = tournament.startups.find(s => s.id === startup1?.id);
      const updatedStartup2 = tournament.startups.find(s => s.id === startup2?.id);
      
      if (updatedStartup1) setStartup1(updatedStartup1);
      if (updatedStartup2) setStartup2(updatedStartup2);
    }
    
    setEventDialogOpen(false);
  };

  const updateStartupStats = (startup: Startup, eventType: EventType) => {
    return {
      ...startup,
      stats: {
        ...startup.stats,
        [EventTypeConfig.mapping[eventType]]: startup.stats[EventTypeConfig.mapping[eventType]] + 1
      }
    };
  };

  const handleEventClick = (startupId: string, eventType: EventType) => {
    if (!battle) return;

    const startup = getStartupById(startupId);
    if (!startup) return;

    addEvent(battle.id, startupId, eventType);

    // Update event counts
    setEventCounts(prev => ({
      ...prev,
      [battle.round]: {
        ...prev[battle.round],
        [startupId]: {
          ...prev[battle.round][startupId],
          [eventType]: prev[battle.round][startupId][eventType] + 1
        }
      }
    }));
    
    // Atualiza os estados locais com as novas pontuações
    if (tournament) {
      const updatedStartup1 = tournament.startups.find(s => s.id === startup1?.id);
      const updatedStartup2 = tournament.startups.find(s => s.id === startup2?.id);
      
      if (updatedStartup1) setStartup1(updatedStartup1);
      if (updatedStartup2) setStartup2(updatedStartup2);
    }
  };

  const getEventCount = (startupId: string) => {
    if (!battle) return 0;
    return Object.values(eventCounts[battle.round]?.[startupId] || {}).reduce((a, b) => a + b, 0);
  };

  const isEventUsedInCurrentRound = (startupId: string, eventType: EventType) => {
    if (!battle) return false;
    return eventCounts[battle.round]?.[startupId]?.[eventType] > 0;
  };

  const getRoundName = (round: number) => {
    const totalStartups = tournament?.startups.length || 0;
    const finalRound = totalStartups === 4 ? 2 : 3;
    
    if (round === finalRound) return 'Final';
    if (round === finalRound - 1) return 'Semifinal';
    return 'Quartas de Final';
  };

  const handleCompleteBattle = async () => {
    if (!battle || !startup1 || !startup2 || !tournament) return;
  
    const isFinalBattle = battle.round === (tournament.startups.length === 4 ? 2 : 3);
  
    // Verifica empate
    if (startup1.score === startup2.score) {
      setShowSharkFight(true);
  
      setTimeout(() => {
        const luckyStartup = Math.random() < 0.5 ? startup1 : startup2;
  
        if (luckyStartup.id === startup1.id) {
          const updatedStartup1 = {
            ...startup1,
            score: startup1.score + 2
          };
          setStartup1(updatedStartup1);
        } else {
          const updatedStartup2 = {
            ...startup2,
            score: startup2.score + 2
          };
          setStartup2(updatedStartup2);
        }
  
        setTimeout(async () => {
          if (battle && luckyStartup) {
            completeBattle(battle.id, luckyStartup.id);
  
            if (isFinalBattle) {
              await salvarHistoricoAutomaticamente(tournament);
            }
  
            navigate('/tournament');
          }
        }, 2000);
      }, 1000);
    } else {
      const winner = startup1.score > startup2.score ? startup1 : startup2;
      completeBattle(battle.id, winner.id);
  
      if (isFinalBattle) {
        await salvarHistoricoAutomaticamente(tournament);
      }
  
      navigate('/tournament');
    }
  };
  

  const canCompleteBattle = () => {
    return true;
  };

  const renderStartupCard = (startup: Startup | null, isSelected: boolean) => {
    if (!startup || !battle) return null;

    return (
      <Paper
        elevation={3}
        onClick={() => !battle.isCompleted && setSelectedStartup(startup.id)}
        sx={{
          p: 3,
          cursor: battle.isCompleted ? 'default' : 'pointer',
          backgroundColor: isSelected ? 'rgba(255, 107, 107, 0.05)' : 'white',
          borderRadius: 2,
          transition: 'all 0.2s',
          border: isSelected ? '2px solid #FF6B6B' : '1px solid rgba(0, 0, 0, 0.12)',
          '&:hover': {
            transform: !battle.isCompleted ? 'scale(1.02)' : 'none',
            boxShadow: !battle.isCompleted ? '0 8px 24px rgba(0,0,0,0.15)' : undefined
          }
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            fontWeight: 900,
            color: '#FF6B6B',
            fontFamily: "'Inter', sans-serif",
            cursor: 'pointer'
          }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/startup/${startup.id}`);
          }}
        >
          {startup.name}
        </Typography>

        <Typography variant="body1" paragraph sx={{ 
          color: 'text.secondary', 
          fontStyle: 'italic',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500
        }}>
          "{startup.slogan}"
        </Typography>

        <Typography variant="h6" sx={{ 
          color: '#FF6B6B', 
          fontWeight: 600,
          mb: 2,
          fontFamily: "'Inter', sans-serif"
        }}>
          {startup.score} pts
        </Typography>

        <Typography variant="subtitle2" gutterBottom sx={{ 
          color: '#666',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500
        }}>
          Eventos:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {Object.entries(EventTypeConfig.icons).map(([type, icon]) => {
            const eventType = type as EventType;
            const statKey = EventTypeConfig.mapping[eventType];
            const count = startup.stats?.[statKey] ?? 0;
            const isUsedInRound = eventCounts[battle.round]?.[startup.id]?.[eventType] > 0;

            return (
              <Tooltip 
                key={type} 
                title={`${EventTypeConfig.labels[eventType]} (${EventTypeConfig.points[eventType]} pts)`}
              >
                <Chip
                  icon={React.cloneElement(icon, { 
                    style: { color: isUsedInRound ? 'white' : EventTypeConfig.colors[eventType] }
                  })}
                  label={count}
                  sx={{
                    backgroundColor: isUsedInRound 
                      ? EventTypeConfig.colors[eventType]
                      : 'transparent',
                    color: isUsedInRound 
                      ? 'white'
                      : EventTypeConfig.colors[eventType],
                    border: `1px solid ${EventTypeConfig.colors[eventType]}`,
                    '&.Mui-disabled': {
                      opacity: 0.7,
                      border: '1px solid #ccc',
                      color: '#666'
                    }
                  }}
                  disabled={isUsedInRound}
                />
              </Tooltip>
            );
          })}
        </Box>

        {isSelected && (
          <Button
            variant="contained"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              setEventDialogOpen(true);
            }}
            sx={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
              color: 'white',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              '&:hover': {
                background: 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)',
              }
            }}
          >
            Aplicar Evento
          </Button>
        )}
      </Paper>
    );
  };

  const salvarHistoricoAutomaticamente = async (tournament: {
    id: string;
    startups: Startup[];
  }) => {
    let tournamentId = "";
  
    try {
      // Cria o torneio no backend
      const response = await fetch("http://localhost:3001/api/tournaments", {
        method: "POST",
      });
  
      const data = await response.json();
      tournamentId = data.id;
      console.log("🏁 Torneio criado com ID:", tournamentId);
    } catch (err) {
      console.error("Erro ao criar torneio:", err);
      return;
    }
  
    const payload = tournament.startups.map((startup: Startup, index: number) => ({
      startupId: startup.id,
      tournamentId,
      finalPosition: index + 1,
      finalScore: startup.score,
      finalPitches: startup.stats.pitches,
      finalBugs: startup.stats.bugs,
      finalTractions: startup.stats.tractions,
      finalAngryInvestors: startup.stats.angryInvestors,
      finalFakeNews: startup.stats.fakeNews,
    }));
  
    try {
      const response = await fetch("http://localhost:3001/api/tournament/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      console.log("✅ Histórico salvo automaticamente:", result);
    } catch (err) {
      console.error("❌ Erro ao salvar histórico automaticamente:", err);
    }
  };
  
  
  

  const renderEventDialog = () => (
    <Dialog 
      open={eventDialogOpen} 
      onClose={() => setEventDialogOpen(false)}
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxWidth: 'sm',
          width: '100%'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
        color: 'white',
        fontWeight: 'bold'
      }}>
        Selecione um Evento
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {Object.entries(EventTypeConfig.labels).map(([type, label]) => {
            const isUsed = Boolean(
              selectedStartup && 
              battle && 
              eventCounts[battle.round]?.[selectedStartup]?.[type as EventType] > 0
            );
            
            return (
              <Grid item xs={12} sm={6} key={type}>
                <Button
                  variant="outlined"
                  fullWidth
                  disabled={isUsed}
                  onClick={() => handleEventSelect(type as EventType)}
                  startIcon={EventTypeConfig.icons[type as EventType]}
                  sx={{
                    borderColor: isUsed ? '#ccc' : EventTypeConfig.colors[type as EventType],
                    color: isUsed ? '#666' : EventTypeConfig.colors[type as EventType],
                    '&:hover': {
                      borderColor: EventTypeConfig.colors[type as EventType],
                      backgroundColor: `${EventTypeConfig.colors[type as EventType]}22`
                    }
                  }}
                >
                  <Box sx={{ textAlign: 'left', flex: 1 }}>
                    <Typography variant="body2">{label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {EventTypeConfig.points[type as EventType]} pontos
                    </Typography>
                  </Box>
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
    </Dialog>
  );

  if (!tournament) {
    return (
      <Box p={3}>
        <Typography variant="h5" color="error">
          Nenhum torneio em andamento
        </Typography>
      </Box>
    );
  }

  if (!battle || !startup1 || !startup2) {
    return (
      <Box p={3}>
        <Typography variant="h5" color="error">
          Batalha não encontrada
        </Typography>
      </Box>
    );
  }

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
        <Typography 
          variant="h3" 
          component="h1" 
          align="center" 
          sx={{ 
            color: '#FF6B6B',
            mb: 6,
            fontWeight: 900,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '-0.02em'
          }}
        >
          {getRoundName(battle.round)}
        </Typography>

        {/* Banner do Shark Fight */}
        {showSharkFight && (
          <Box 
            sx={{ 
              mb: 4,
              p: 3,
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              borderRadius: 2,
              textAlign: 'center',
              animation: 'pulse 1.5s infinite',
              border: '2px solid #FF6B6B'
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#FF6B6B',
                fontWeight: 900,
                fontFamily: "'Inter', sans-serif",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
              }}
            >
              🦈 SHARK FIGHT! 🦈
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#FF6B6B',
                mt: 1,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600
              }}
            >
              Empate! Os tubarões decidirão o vencedor!
            </Typography>
          </Box>
        )}

        <Grid container spacing={4} alignItems="stretch">
          <Grid item xs={12} md={6}>
            {renderStartupCard(startup1, selectedStartup === startup1?.id)}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderStartupCard(startup2, selectedStartup === startup2?.id)}
          </Grid>
        </Grid>

        <Box sx={{ 
          mt: 'auto', 
          pt: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleCompleteBattle}
            startIcon={<EmojiEventsIcon />}
            sx={{ 
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: '1.1rem',
              fontFamily: "'Inter', sans-serif",
              py: 1.5,
              px: 4,
              '&:hover': {
                background: 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)',
              }
            }}
          >
            Finalizar Batalha
          </Button>
        </Box>
      </Container>

      {renderEventDialog()}

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </Box>
  );
} 