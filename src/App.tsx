import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { StartupRegistration } from './components/StartupRegistration';
import { TournamentBracket } from './components/TournamentBracket';
import Battle from './components/Battle';
import { FinalReport } from './components/FinalReport';
import { StartupDetails } from './components/StartupDetails';
import { TournamentMenu } from './components/TournamentMenu';
import { LandingPage } from './components/LandingPage';
import { useTournamentStore } from './store/tournamentStore';
import AssessmentIcon from '@mui/icons-material/Assessment';

function MainContent() {
  const { tournament } = useTournamentStore();
  const location = useLocation();
  const showMenu = tournament && 
    tournament.battles && 
    tournament.battles.length > 0 && 
    !location.pathname.includes('/battle/') &&
    location.pathname !== '/';

  console.log('App rendered', { 
    tournamentExists: !!tournament, 
    battlesCount: tournament?.battles?.length,
    isCompleted: tournament?.isCompleted,
    currentPath: location.pathname
  });

  return (
    <>
      {showMenu && <TournamentMenu />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<StartupRegistration />} />
        <Route path="/tournament" element={<TournamentBracket />} />
        <Route path="/battle/:battleId" element={<Battle />} />
        <Route path="/report" element={<FinalReport />} />
        <Route path="/startup/:startupId" element={<StartupDetails />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
