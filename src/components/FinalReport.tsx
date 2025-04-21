import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { useTournamentStore } from '../store/tournamentStore';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BugReportIcon from '@mui/icons-material/BugReport';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';

export const FinalReport: React.FC = () => {
  const { tournament, setTournament, resetTournament } = useTournamentStore();
  const navigate = useNavigate();


  // Adiciona um console.log para debug
  console.log('FinalReport rendered', { 
    tournamentExists: !!tournament, 
    isCompleted: tournament?.isCompleted,
    totalStartups: tournament?.startups?.length
  });

  // Verifica se existe um torneio
  if (!tournament) {
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
          Nenhum torneio em andamento
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
          Iniciar Novo Torneio
        </Button>
      </Box>
    );
  }

  // Ordena as startups por pontuação
  const sortedStartups = [...tournament.startups].sort((a, b) => {
    // Primeiro critério: número de batalhas vencidas
    const aWins = tournament.battles.filter(b => b.winner === a.id).length;
    const bWins = tournament.battles.filter(b => b.winner === b.id).length;
    if (aWins !== bWins) return bWins - aWins;

    // Segundo critério: pontuação
    return b.score - a.score;
  });
  const handleSaveHistory = async () => {
    let tournamentId = "";
    try {
      const response = await fetch("http://localhost:3001/api/tournaments", {
        method: "POST",
      });
  
      const data = await response.json();
      tournamentId = data.id;
      console.log("🏁 Torneio criado com ID:", tournamentId);
    } catch (err) {
      console.error("Erro ao criar torneio:", err);
      alert("Erro ao criar o torneio.");
      return;
    }
  
    const payload = sortedStartups.map((startup, index) => ({
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
  
    console.log("📦 Payload enviado para o backend:", payload);
  
    try {
      const response = await fetch('http://localhost:3001/api/tournament/finalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      console.log("✅ Resposta do backend:", result);
      alert('Histórico salvo com sucesso!');
  
      // Atualiza startups com participationHistory na store
      const updatedStartups = sortedStartups.map((startup, index) => ({
        ...startup,
        participationHistory: [
          ...(startup.participationHistory || []),
          {
            edition: parseInt(tournamentId.split('-')[1], 10),
            position: index + 1,
            score: startup.score,
            finalPitches: startup.stats.pitches,
            finalBugs: startup.stats.bugs,
            finalTractions: startup.stats.tractions,
            finalAngryInvestors: startup.stats.angryInvestors,
            finalFakeNews: startup.stats.fakeNews,
            events: [] // ← se tiver os eventos, você pode preencher aqui
          }
        ]
      }));
  
      setTournament({
        ...tournament!,
        startups: updatedStartups
      });
  
    } catch (error) {
      console.error("❌ Erro ao salvar histórico:", error);
      alert('Erro ao salvar histórico');
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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            letterSpacing: '-0.02em'
          }}
        >
          {tournament.isCompleted ? 'Relatório Final do Torneio' : 'Relatório Parcial do Torneio'}
        </Typography>

        {/* Card do Vencedor - só mostra se o torneio estiver completo */}
        {tournament.isCompleted && (
          <Card
            sx={{
              mb: 6,
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              position: 'relative',
              overflow: 'visible'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -30,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#FFD700',
                borderRadius: '50%',
                width: 60,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
              }}
            >
              <EmojiEventsIcon sx={{ fontSize: 40, color: '#FFA000' }} />
            </Box>

            <CardContent sx={{ pt: 4, pb: 3, px: 4, textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 900,
                  mb: 1,
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                {tournament.winner?.name}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontStyle: 'italic',
                  mb: 2,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500
                }}
              >
                "{tournament.winner?.slogan}"
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                Pontuação Final: {tournament.winner?.score} pontos
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Tabela de Classificação */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            mb: 6,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ 
                    fontWeight: 900,
                    fontFamily: "'Inter', sans-serif",
                    color: '#FF6B6B'
                  }}
                >
                  Posição
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 900,
                    fontFamily: "'Inter', sans-serif",
                    color: '#FF6B6B'
                  }}
                >
                  Startup
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 900,
                    fontFamily: "'Inter', sans-serif",
                    color: '#FF6B6B'
                  }}
                >
                  Pontuação
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 900,
                    fontFamily: "'Inter', sans-serif",
                    color: '#FF6B6B'
                  }}
                >
                  Estatísticas
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 900,
                    fontFamily: "'Inter', sans-serif",
                    color: '#FF6B6B'
                  }}
                >
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedStartups.map((startup, index) => (
                <TableRow 
                  key={startup.id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor: index === 0 ? 'rgba(76, 175, 80, 0.1)' : 'white'
                  }}
                >
                  <TableCell 
                    sx={{ 
                      fontWeight: 600,
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    {index + 1}º
                  </TableCell>
                  <TableCell>
                    <Typography 
                      sx={{ 
                        fontWeight: 600,
                        fontFamily: "'Inter', sans-serif"
                      }}
                    >
                      {startup.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500
                      }}
                    >
                      {startup.slogan}
                    </Typography>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600,
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    {startup.score} pts
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<RocketLaunchIcon />}
                        label={`${startup.stats.pitches} Pitches`}
                        sx={{ 
                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                          color: '#4CAF50',
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500
                        }}
                      />
                      <Chip
                        icon={<BugReportIcon />}
                        label={`${startup.stats.bugs} Bugs`}
                        sx={{ 
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          color: '#f44336',
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500
                        }}
                      />
                      <Chip
                        icon={<TrendingUpIcon />}
                        label={`${startup.stats.tractions} Trações`}
                        sx={{ 
                          backgroundColor: 'rgba(33, 150, 243, 0.1)',
                          color: '#2196f3',
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500
                        }}
                      />
                      <Chip
                        icon={<SentimentVeryDissatisfiedIcon />}
                        label={`${startup.stats.angryInvestors} Investidores Irritados`}
                        sx={{ 
                          backgroundColor: 'rgba(255, 152, 0, 0.1)',
                          color: '#ff9800',
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500
                        }}
                      />
                      <Chip
                        icon={<NewspaperIcon />}
                        label={`${startup.stats.fakeNews} Fake News`}
                        sx={{ 
                          backgroundColor: 'rgba(156, 39, 176, 0.1)',
                          color: '#9c27b0',
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<InfoIcon />}
                      onClick={() => navigate(`/startup/${startup.id}`)}
                      sx={{ 
                        color: '#FF6B6B',
                        borderColor: '#FF6B6B',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: '#FF8E53',
                          backgroundColor: 'rgba(255, 107, 107, 0.04)',
                        }
                      }}
                    >
                      Mais detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Botão de Novo Torneio - só aparece quando o torneio estiver completo */}
        {tournament.isCompleted && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => {
                resetTournament();
                navigate('/');
              }}
              startIcon={<RocketLaunchIcon />}
              sx={{ 
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '1.1rem',
                py: 2,
                px: 5,
                fontFamily: "'Inter', sans-serif",
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Novo Torneio
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}; 