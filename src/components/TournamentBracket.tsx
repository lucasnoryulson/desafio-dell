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
      elevation={2}
      sx={{
        p: isFourStartups ? 2 : 1,
        mb: 1,
        backgroundColor: isWinner ? '#4CAF50' : '#FF6B6B',
        color: 'white',
        borderRadius: 1,
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
        },
        minHeight: isFourStartups ? '50px' : '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Typography variant={isFourStartups ? "body1" : "body2"} sx={{ fontWeight: 'bold' }}>
        {startup.name}
      </Typography>
      <Typography variant={isFourStartups ? "body1" : "body2"}>
        {startup.score} pts
      </Typography>
    </Paper>
  );

  const renderBattleCard = (battle: Battle) => (
    <Paper
      elevation={3}
      sx={{
        p: isFourStartups ? 3 : 2,
        mb: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 2,
        width: '100%',
        maxWidth: isFourStartups ? '400px' : '300px'
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
            sx={{ fontWeight: 'bold' }}
          >
            {getRoundName(battle.round)}
          </Typography>
          {!battle.isCompleted && (
            <Button
              size={isFourStartups ? "medium" : "small"}
              variant="contained"
              sx={{ 
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)',
                }
              }}
              onClick={() => handleBattleClick(battle.id)}
            >
              Avaliar
            </Button>
          )}
        </Box>
        <Box onClick={() => battle.isCompleted ? null : handleBattleClick(battle.id)}>
          {renderStartupCard(battle.startup1, battle.startup1.score, battle.winner === battle.startup1.id)}
          {renderStartupCard(battle.startup2, battle.startup2.score, battle.winner === battle.startup2.id)}
        </Box>
      </Box>
      {battle.isCompleted && battle.winner && (
        <Typography 
          variant={isFourStartups ? "body1" : "caption"}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: '#4CAF50',
            fontWeight: 'bold' 
          }}
        >
          <EmojiEventsIcon sx={{ fontSize: isFourStartups ? 20 : 16, mr: 0.5 }} />
          Vencedor: {tournament.startups.find(s => s.id === battle.winner)?.name}
        </Typography>
      )}
    </Paper>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
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
            color: 'white',
            mb: 6,
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
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
                  color: 'white',
                  mb: 4,
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
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
                color: 'white',
                mb: 4,
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
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
                color: 'white',
                mb: 4,
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
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
              onClick={() => {
                console.log('Navigating to final report', { 
                  tournamentExists: !!tournament, 
                  isCompleted: tournament?.isCompleted 
                });
                navigate('/report');
              }}
              startIcon={<AssessmentIcon />}
              sx={{ 
                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                py: 2,
                px: 5,
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