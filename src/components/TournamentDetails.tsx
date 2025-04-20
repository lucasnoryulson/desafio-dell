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
} from '@mui/material';
import { useTournamentStore } from '../store/tournamentStore';
import { useNavigate } from 'react-router-dom';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BugReportIcon from '@mui/icons-material/BugReport';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import NewspaperIcon from '@mui/icons-material/Newspaper';

export const TournamentDetails: React.FC = () => {
  const { tournament } = useTournamentStore();
  const navigate = useNavigate();

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
        <Typography variant="h5" sx={{ color: 'white', textAlign: 'center' }}>
          Nenhum torneio em andamento
        </Typography>
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
          Detalhes do Torneio
        </Typography>

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
                    size="small"
                    sx={{ backgroundColor: '#4CAF50', color: 'white' }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  <Chip
                    icon={<BugReportIcon />}
                    label="Bugs"
                    size="small"
                    sx={{ backgroundColor: '#f44336', color: 'white' }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  <Chip
                    icon={<TrendingUpIcon />}
                    label="Tração"
                    size="small"
                    sx={{ backgroundColor: '#2196f3', color: 'white' }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  <Chip
                    icon={<SentimentVeryDissatisfiedIcon />}
                    label="Investidor"
                    size="small"
                    sx={{ backgroundColor: '#ff9800', color: 'white' }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  <Chip
                    icon={<NewspaperIcon />}
                    label="Fake News"
                    size="small"
                    sx={{ backgroundColor: '#9c27b0', color: 'white' }}
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedStartups.map((startup, index) => (
                <TableRow
                  key={startup.id}
                  sx={{
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => navigate(`/startup/${startup.id}`)}
                >
                  <TableCell>
                    <Chip
                      label={`${index + 1}º`}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        color: 'rgba(0, 0, 0, 0.6)',
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'normal' }}>
                    {startup.name}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: startup.score >= 70 ? '#4CAF50' : '#f44336' }}>
                    {startup.score} pts
                  </TableCell>
                  <TableCell align="center">{startup.stats.pitches}</TableCell>
                  <TableCell align="center">{startup.stats.bugs}</TableCell>
                  <TableCell align="center">{startup.stats.tractions}</TableCell>
                  <TableCell align="center">{startup.stats.angryInvestors}</TableCell>
                  <TableCell align="center">{startup.stats.fakeNews}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}; 