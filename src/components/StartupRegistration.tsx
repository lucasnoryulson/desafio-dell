import React, { useState } from 'react';
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
  Divider,
  Container,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTournamentStore } from '../store/tournamentStore';
import { Startup } from '../types';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

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
  
  const { tournament, addStartup, startTournament } = useTournamentStore();
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          {/* Left Section */}
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h3" 
              component="h1" 
              align="center" 
              sx={{ 
                color: 'white',
                mb: 4,
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              Startup Rush
            </Typography>
            <Typography 
              variant="h5" 
              align="center" 
              sx={{ 
                color: 'white',
                mb: 6,
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              Cadastre sua startup e participe do torneio mais emocionante do ecossistema!
            </Typography>
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4,
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography 
                variant="h4" 
                gutterBottom 
                align="center" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#FF6B6B'
                }}
              >
                Cadastre sua Startup
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nome da Startup"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Slogan"
                      value={slogan}
                      onChange={(e) => setSlogan(e.target.value)}
                      required
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Descrição"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      multiline
                      rows={4}
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ano de Fundação"
                      type="number"
                      value={foundingYear}
                      onChange={(e) => setFoundingYear(e.target.value)}
                      required
                      variant="outlined"
                      inputProps={{ min: 1900, max: new Date().getFullYear() }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      size="large"
                      disabled={(tournament?.startups.length || 0) >= 8}
                      sx={{ 
                        height: 48,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)',
                        }
                      }}
                    >
                      Cadastrar Startup
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {tournament?.startups.length ? (
                <>
                  <Divider sx={{ my: 4 }} />
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    align="center" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#FF6B6B'
                    }}
                  >
                    Startups Cadastradas
                  </Typography>
                  <List sx={{ 
                    bgcolor: 'background.paper', 
                    borderRadius: 2,
                    border: '1px solid rgba(0,0,0,0.1)'
                  }}>
                    {tournament.startups.map((startup) => (
                      <ListItem key={startup.id}>
                        <ListItemText
                          primary={startup.name}
                          secondary={`${startup.slogan} (${startup.foundingYear})`}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      onClick={handleStartTournament}
                      disabled={(tournament.startups.length || 0) < 4}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    >
                      Iniciar Torneio
                    </Button>
                  </Box>
                </>
              ) : null}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Startup cadastrada com sucesso!
        </Alert>
      </Snackbar>

      {/* Dialog de confirmação para startup existente */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
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
          Startup já cadastrada
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography>
            A startup "{existingStartup?.name}" já está cadastrada no sistema. Deseja inscrevê-la na competição?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setDialogOpen(false)}
            sx={{ 
              color: '#666',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.05)'
              }
            }}
          >
            Não, cadastrar nova
          </Button>
          <Button
            onClick={handleUseExistingStartup}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)',
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