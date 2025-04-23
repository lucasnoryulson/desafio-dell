import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTournamentStore } from '../store/tournamentStore';
import { Battle, Startup } from '../types';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssessmentIcon from '@mui/icons-material/Assessment';

export const TournamentBracket: React.FC = () => {
  const { tournament } = useTournamentStore();
  const navigate = useNavigate();

  console.log('TournamentBracket rendered', { 
    tournamentExists: !!tournament, 
    isCompleted: tournament?.isCompleted,
    totalStartups: tournament?.startups?.length
  });

  if (!tournament) return null;

  const isFourStartups = tournament.startups.length === 4;

  const battlesByRound = tournament.battles.reduce((acc, battle) => {
    if (!acc[battle.round]) {
      acc[battle.round] = [];
    }
    acc[battle.round].push(battle);
    return acc;
  }, {} as Record<number, Battle[]>);

  const handleBattleClick = (battleId: string) => {
    navigate(`/battle/${battleId}`);
  };

  const getRoundName = (round: number) => {
    const finalRound = isFourStartups ? 2 : 3;
    
    if (round === finalRound) return 'Final';
    if (round === finalRound - 1) return 'Semifinal';
    return 'Quartas de Final';
  };

  const renderStartupCard = (startup: Startup, pts: number, isWinner: boolean = false) => (
    <Paper
      elevation={3}
      sx={{
        p: isFourStartups ? 2 : 1,
        mb: 1,
        backgroundColor: isWinner ? '#4CAF50' : '#FF6B6B',
        color: 'white',
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        },
        minHeight: isFourStartups ? '50px' : '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Typography 
        variant={isFourStartups ? "body1" : "body2"} 
        sx={{ 
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {startup.name}
      </Typography>
      <Typography 
        variant={isFourStartups ? "body1" : "body2"}
        sx={{ 
          fontWeight: 500,
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {startup.score} pts
      </Typography>
    </Paper>
  );

  const renderBattleCard = (battle: Battle) => {
    // ✅ Aqui é o lugar correto para lógica JS
    const updatedStartup1 = tournament.startups.find(s => s.id === battle.startup1.id) || battle.startup1;
    const updatedStartup2 = tournament.startups.find(s => s.id === battle.startup2.id) || battle.startup2;
  
    return (
      <Paper
        elevation={3}
        sx={{
          p: isFourStartups ? 3 : 2,
          mb: 2,
          backgroundColor: 'white',
          borderRadius: 2,
          width: '100%',
          maxWidth: isFourStartups ? '400px' : '300px',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          },
        }}
      >
        <Box sx={{ mb: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 1
          }}>
            <Typography 
              variant={isFourStartups ? "h6" : "subtitle2"} 
              color="#FF6B6B" 
              sx={{ 
                fontWeight: 900,
                fontFamily: "'Inter', sans-serif"
              }}
            >
              {getRoundName(battle.round)}
            </Typography>
            {!battle.isCompleted && (
              <Button
                size={isFourStartups ? "medium" : "small"}
                variant="contained"
                sx={{ 
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                  color: 'white',
                  boxShadow: '0 3px 5px 2px rgba(255, 107, 107, .3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)',
                  },
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  textTransform: 'none'
                }}
                onClick={() => handleBattleClick(battle.id)}
              >
                Avaliar
              </Button>
            )}
          </Box>
  
          <Box onClick={() => battle.isCompleted ? null : handleBattleClick(battle.id)}>
            {renderStartupCard(updatedStartup1, updatedStartup1.score, battle.winner === updatedStartup1.id)}
            {renderStartupCard(updatedStartup2, updatedStartup2.score, battle.winner === updatedStartup2.id)}
          </Box>
        </Box>
  
        {battle.isCompleted && battle.winner && (
          <Typography 
            variant={isFourStartups ? "body1" : "caption"}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: '#4CAF50',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif"
            }}
          >
            <EmojiEventsIcon sx={{ fontSize: isFourStartups ? 20 : 16, mr: 0.5 }} />
            Vencedor: {tournament.startups.find(s => s.id === battle.winner)?.name}
          </Typography>
        )}
      </Paper>
    );
  };
  

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <Container 
        maxWidth={false}
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          py: 4,
          height: '100%',
          maxWidth: '1600px'
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          align="center" 
          sx={{ 
            color: '#FF6B6B',
            mb: 6,
            fontWeight: 900,
            fontFamily: "'Inter', sans-serif",
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            letterSpacing: '-0.02em'
          }}
        >
          Chaveamento do Torneio
        </Typography>

        <Grid 
          container 
          spacing={4} 
          justifyContent="center"
          alignItems={isFourStartups ? "center" : "flex-start"}
          sx={{ 
            flex: 1,
            mb: tournament?.isCompleted ? 4 : 0,
            height: '100%'
          }}
        >
          {!isFourStartups && (
            <Grid item xs={12} md={3}>
              <Typography 
                variant="h6" 
                align="center" 
                sx={{ 
                  color: '#FF6B6B',
                  mb: 4,
                  fontWeight: 900,
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                Quartas de Final
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {battlesByRound[1]?.map((battle) => (
                  <Box key={battle.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                    {renderBattleCard(battle)}
                  </Box>
                ))}
              </Box>
            </Grid>
          )}

          <Grid item xs={12} md={isFourStartups ? 6 : 3}>
            <Typography 
              variant="h6" 
              align="center" 
              sx={{ 
                color: '#FF6B6B',
                mb: 4,
                fontWeight: 900,
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Semifinais
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {battlesByRound[isFourStartups ? 1 : 2]?.map((battle) => (
                <Box key={battle.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  {renderBattleCard(battle)}
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={isFourStartups ? 6 : 3}>
            <Typography 
              variant="h6" 
              align="center" 
              sx={{ 
                color: '#FF6B6B',
                mb: 4,
                fontWeight: 900,
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Final
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {battlesByRound[isFourStartups ? 2 : 3]?.map((battle) => (
                <Box key={battle.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  {renderBattleCard(battle)}
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        {tournament?.isCompleted && (
          <Box sx={{ 
            width: '100%',
            display: 'flex', 
            justifyContent: 'center',
            mt: 'auto',
            pt: 4,
            mb: 4
          }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/report')}
              startIcon={<AssessmentIcon />}
              sx={{ 
                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '1.1rem',
                py: 2,
                px: 5,
                fontFamily: "'Inter', sans-serif",
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #45a049 0%, #4CAF50 100%)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Ver Relatório Final
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}; 