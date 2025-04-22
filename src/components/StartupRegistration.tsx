import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Container,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTournamentStore } from '../store/tournamentStore';
import { Startup } from '../types';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CloseIcon from '@mui/icons-material/Close';

const API_URL = 'http://localhost:3001/api';

export const StartupRegistration: React.FC = () => {
  const [name, setName] = useState('');
  const [slogan, setSlogan] = useState('');
  const [description, setDescription] = useState('');
  const [foundingYear, setFoundingYear] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [existingStartup, setExistingStartup] = useState<Startup | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startups, setStartups] = useState<Startup[]>([]);
  
  const { tournament, addStartup, startTournament, removeStartup } = useTournamentStore();
  const navigate = useNavigate();

  const checkExistingStartup = async (startupName: string) => {
    try {
      console.log(`Verificando startup existente: "${startupName}"`);
      const response = await fetch(`${API_URL}/startups/check/${encodeURIComponent(startupName)}`);
      const data = await response.json();
      
      console.log(`Resposta da API:`, data);
      
      if (data.exists) {
        console.log(`Startup encontrada:`, data.startup);
        setExistingStartup(data.startup);
        setDialogOpen(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar startup:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name || !slogan || !foundingYear) {
      setError('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const year = parseInt(foundingYear);
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
      setError('Por favor, insira um ano válido!');
      return;
    }

    // Verifica se a startup já existe
    const exists = await checkExistingStartup(name);
    if (exists) {
      return;
    }

    await registerNewStartup(name, slogan, description, year);
  };

  const registerNewStartup = async (startupName: string, startupSlogan: string, startupDescription: string, year: number) => {
    try {
      const response = await fetch(`${API_URL}/startups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: startupName,
          slogan: startupSlogan,
          description: startupDescription,
          foundingYear: year,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao cadastrar startup');
      }

      const newStartup: Startup = await response.json();
      addStartup(newStartup);
      
      // Limpa o formulário
      setName('');
      setSlogan('');
      setDescription('');
      setFoundingYear('');
      
      // Mostra mensagem de sucesso
      setSuccess(true);
    } catch (error) {
      console.error('Erro ao cadastrar startup:', error);
      setError(error instanceof Error ? error.message : 'Erro ao cadastrar startup');
    }
  };

  const handleUseExistingStartup = () => {
    if (existingStartup) {
      addStartup(existingStartup);
      setDialogOpen(false);
      setExistingStartup(null);
      setSuccess(true);
    }
  };

  const handleStartTournament = () => {
    if ((tournament?.startups.length || 0) < 4) {
      setError('É necessário ter pelo menos 4 startups para iniciar o torneio!');
      return;
    }
    startTournament();
    navigate('/tournament');
  };

  useEffect(() => {
    if (tournament) {
      setStartups(tournament.startups);
    }
  }, [tournament]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        backgroundColor: '#f8f9fa',
        position: 'relative',
      }}
    >
      {/* Formulário de Cadastro - Lado Esquerdo */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          p: { xs: 2, md: 4 },
          backgroundColor: '#fff',
          borderRight: '1px solid rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: '#1a1a1a',
              mb: 4,
              fontFamily: "'Inter', sans-serif",
              pt: { xs: 0, md: 4 },
            }}
          >
            Cadastre sua Startup
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nome da Startup"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8f9fa',
                },
              }}
            />

            <TextField
              fullWidth
              label="Slogan"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8f9fa',
                },
              }}
            />

            <TextField
              fullWidth
              label="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8f9fa',
                },
              }}
            />

            <TextField
              fullWidth
              label="Ano de Fundação"
              type="number"
              value={foundingYear}
              onChange={(e) => setFoundingYear(e.target.value)}
              required
              inputProps={{ min: 1900, max: new Date().getFullYear() }}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8f9fa',
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={(tournament?.startups.length || 0) >= 8}
              sx={{
                py: 1.5,
                backgroundColor: '#ff4d4d',
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#ff3333',
                },
              }}
            >
              Cadastrar Startup
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Lista de Startups - Lado Direito */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          p: { xs: 2, md: 4 },
          display: { xs: 'block', md: 'block' },
          backgroundColor: '#fff',
        }}
      >
        <Box sx={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: '#1a1a1a',
              mb: 2,
              fontFamily: "'Inter', sans-serif",
              pt: { xs: 0, md: 4 },
            }}
          >
            Participantes
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#666',
              mb: 4,
              fontStyle: 'italic',
            }}
          >
            O torneio requer no mínimo 4 e no máximo 8 startups para começar
          </Typography>

          {tournament?.startups.length ? (
            <>
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                  Startups Participantes ({tournament.startups.length}/8)
                </Typography>
                <Grid container spacing={2}>
                  {tournament.startups.map((startup, index) => (
                    <Grid item xs={12} sm={6} md={4} key={startup.id}>
                      <Card 
                        sx={{ 
                          position: 'relative',
                          '&:hover .remove-button': {
                            opacity: 1,
                            color: '#FF6B6B'
                          }
                        }}
                      >
                        <IconButton
                          className="remove-button"
                          size="small"
                          onClick={() => removeStartup(startup.id)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            opacity: 0.3,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 107, 107, 0.1)'
                            }
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                        <CardContent>
                          <Typography variant="h6" sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                            {startup.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                            "{startup.slogan}"
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={handleStartTournament}
                disabled={(tournament.startups.length || 0) < 4}
                startIcon={<RocketLaunchIcon />}
                sx={{
                  width: '100%',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#43A047',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(0,0,0,0.12)',
                  },
                }}
              >
                Iniciar Torneio
              </Button>
            </>
          ) : (
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                textAlign: 'center',
                py: 8,
              }}
            >
              Nenhuma startup cadastrada ainda.
            </Typography>
          )}
        </Box>
      </Box>

      {/* Snackbars e Dialog */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Startup cadastrada com sucesso!
        </Alert>
      </Snackbar>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 'sm',
            width: '100%',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Startup já cadastrada
        </DialogTitle>
        <DialogContent>
          <Typography>
            A startup "{existingStartup?.name}" já está cadastrada no sistema. Deseja inscrevê-la na competição?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{ color: '#666' }}
          >
            Não, cadastrar nova
          </Button>
          <Button
            onClick={handleUseExistingStartup}
            variant="contained"
            sx={{
              backgroundColor: '#ff4d4d',
              '&:hover': {
                backgroundColor: '#ff3333',
              }
            }}
          >
            Sim, inscrever
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 