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
import { useNavigate } from 'react-router-dom';

export const FinalReport: React.FC = () => {
  const { tournament } = useTournamentStore();
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
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="h5" sx={{ color: 'white', textAlign: 'center', mb: 2 }}>
          Nenhum torneio em andamento
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ 
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #45a049 0%, #4CAF50 100%)',
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
    // 1. Cria o torneio no backend e pega o ID real (UUID)
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
  
    // 2. Monta o payload com o tournamentId real
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
  
    // 3. Envia o payload para salvar o histórico
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
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
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
            color: 'white',
            mb: 6,
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
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
                  fontWeight: 'bold',
                  mb: 1,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                }}
              >
                {tournament.winner?.name}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontStyle: 'italic',
                  mb: 2
                }}
              >
                "{tournament.winner?.slogan}"
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontWeight: 'bold'
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
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)'
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.03)'
                }}
              >
                <TableCell sx={{ fontWeight: 'bold' }}>Posição</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Startup</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Pontuação</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  <Chip
                    icon={<RocketLaunchIcon />}
                    label="Pitches"
                    sx={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      '& .MuiSvgIcon-root': { color: 'white' }
                    }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  <Chip
                    icon={<BugReportIcon />}
                    label="Bugs"
                    sx={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      '& .MuiSvgIcon-root': { color: 'white' }
                    }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  <Chip
                    icon={<TrendingUpIcon />}
                    label="Tração"
                    sx={{
                      backgroundColor: '#2196f3',
                      color: 'white',
                      '& .MuiSvgIcon-root': { color: 'white' }
                    }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  <Chip
                    icon={<SentimentVeryDissatisfiedIcon />}
                    label="Investidor"
                    sx={{
                      backgroundColor: '#ff9800',
                      color: 'white',
                      '& .MuiSvgIcon-root': { color: 'white' }
                    }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  <Chip
                    icon={<NewspaperIcon />}
                    label="Fake News"
                    sx={{
                      backgroundColor: '#9c27b0',
                      color: 'white',
                      '& .MuiSvgIcon-root': { color: 'white' }
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedStartups.map((startup, index) => {
                const position = index + 1;
                const isEliminated = tournament.isCompleted && position > 1;
                
                return (
                  <TableRow 
                    key={startup.id}
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      },
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      },
                    }}
                    onClick={() => navigate(`/startup/${startup.id}`)}
                  >
                    <TableCell>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: tournament.isCompleted ? (position === 1 ? '#4CAF50' : isEliminated ? '#f44336' : 'inherit') : 'inherit'
                        }}
                      >
                        {position}º
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: tournament.isCompleted ? (position === 1 ? '#4CAF50' : isEliminated ? '#f44336' : 'inherit') : 'inherit'
                        }}
                      >
                        {startup.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: tournament.isCompleted ? (position === 1 ? '#4CAF50' : isEliminated ? '#f44336' : 'inherit') : 'inherit'
                        }}
                      >
                        {startup.score} pts
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{startup.stats.pitches}</TableCell>
                    <TableCell align="center">{startup.stats.bugs}</TableCell>
                    <TableCell align="center">{startup.stats.tractions}</TableCell>
                    <TableCell align="center">{startup.stats.angryInvestors}</TableCell>
                    <TableCell align="center">{startup.stats.fakeNews}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
    <Button
      variant="contained"
      onClick={handleSaveHistory}
      sx={{
        background: 'linear-gradient(135deg, #4CAF50 0%, #2e7d32 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #2e7d32 0%, #4CAF50 100%)',
        },
      }}
    >
      Salvar Histórico no Backend
    </Button>
  </Box>

      </Container>
    </Box>
  );
}; 