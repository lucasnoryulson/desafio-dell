import { create } from 'zustand';
import { 
  Battle, 
  Startup, 
  Tournament, 
  EventType, 
  BattleEvent, 
  EventTypeLabels,
  RoundPhase,
  TournamentEvent
} from '../types';

interface TournamentState {
  tournament: Tournament | null;
  setTournament: (tournament: Tournament) => void;
  addStartup: (startup: Startup) => void;
  removeStartup: (id: string) => void;
  startTournament: () => void;
  completeBattle: (battleId: string, winnerId: string) => void;
  addEvent: (battleId: string, startupId: string, eventType: EventType) => void;
  getCurrentBattles: () => Battle[];
  getStartupById: (id: string) => Startup | undefined;
  resetTournament: () => void; 
  updateStartup: (updatedStartup: Startup) => void;
}


const INITIAL_SCORE = 70;
const WINNER_BONUS = 30;

const EventPoints: Record<EventType, number> = {
  'PITCH': 6,
  'BUG': -4,
  'TRACTION': 3,
  'ANGRY_INVESTOR': -6,
  'FAKE_NEWS': -8
};

export const useTournamentStore = create<TournamentState>((set, get) => ({
  updateStartup: (updatedStartup) => {
    const currentTournament = get().tournament;
    if (!currentTournament) return;

    set({
      tournament: {
        ...currentTournament,
        startups: currentTournament.startups.map(s =>
          s.id === updatedStartup.id ? { ...updatedStartup } : s
        ),
      }
    });
  },

  resetTournament: () => set({ tournament: null }),

  tournament: null,

  setTournament: (tournament) => set({ tournament }),

  addStartup: (startup) => {
    const currentTournament = get().tournament;
    
    // Se não existir um torneio, cria um novo
    if (!currentTournament) {
      set({
        tournament: {
          id: `tournament-${Date.now()}`,
          startups: [{
            ...startup,
            participationHistory: [],
            stats: {
              pitches: 0,
              bugs: 0,
              tractions: 0,
              angryInvestors: 0,
              fakeNews: 0
            }
          }],
          battles: [],
          currentRound: 0,
          isCompleted: false,
        },
      });
      return;
    }

    // Verifica se já existe uma startup com o mesmo nome
    const existingStartup = currentTournament.startups.find(
      s => s.name.toLowerCase() === startup.name.toLowerCase()
    );

    if (existingStartup) {
      alert('Esta startup já está inscrita no torneio. Por favor, inscreva uma startup diferente.');
      return;
    }

    // Se já existir um torneio, verifica o limite de startups
    if (currentTournament.startups.length >= 8) {
      alert('Máximo de 8 startups atingido!');
      return;
    }

    set({
      tournament: {
        ...currentTournament,
        startups: [...currentTournament.startups, {
          ...startup,
          participationHistory: [],
          stats: {
            pitches: 0,
            bugs: 0,
            tractions: 0,
            angryInvestors: 0,
            fakeNews: 0
          }
        }],
      },
    });
  },

  removeStartup: (id) => {
    const currentTournament = get().tournament;
    if (!currentTournament) return;

    set({
      tournament: {
        ...currentTournament,
        startups: currentTournament.startups.filter((s) => s.id !== id),
      },
    });
  },

  startTournament: () => {
    const currentTournament = get().tournament;
    if (!currentTournament) return;

    if (currentTournament.startups.length < 4 || currentTournament.startups.length % 2 !== 0) {
      alert('O torneio precisa ter entre 4 e 8 startups (número par)!');
      return;
    }

    // Shuffle startups
    const shuffledStartups = [...currentTournament.startups].sort(() => Math.random() - 0.5);
    
    // Determina o número de rodadas com base no número de startups
    const numStartups = shuffledStartups.length;
    const numRounds = numStartups === 4 ? 2 : 3; // 4 startups = 2 rodadas (semifinais + final), 8 startups = 3 rodadas (quartas + semis + final)
    
    // Cria as batalhas iniciais (primeira rodada)
    const initialBattles: Battle[] = [];
    for (let i = 0; i < shuffledStartups.length; i += 2) {
      initialBattles.push({
        id: `battle-${i}`,
        round: 1,
        startup1: shuffledStartups[i],
        startup2: shuffledStartups[i + 1],
        isCompleted: false,
      });
    }

    set({
      tournament: {
        ...currentTournament,
        battles: initialBattles,
        currentRound: 1,
        isCompleted: false,
      },
    });
  },

  completeBattle: (battleId, winnerId) => {
    const currentTournament = get().tournament;
    if (!currentTournament) return;

    const battle = currentTournament.battles.find((b) => b.id === battleId);
    if (!battle) return;

    // Encontra as startups da batalha
    const startup1 = currentTournament.startups.find((s) => s.id === battle.startup1.id);
    const startup2 = currentTournament.startups.find((s) => s.id === battle.startup2.id);
    if (!startup1 || !startup2) return;

    // Verifica se houve empate e se o winnerId não foi definido pelo componente
    if (startup1.score === startup2.score && !winnerId) {
      // Shark Fight! Escolhe aleatoriamente uma startup para receber +2 pontos
      const luckyStartup = Math.random() < 0.5 ? startup1 : startup2;
      winnerId = luckyStartup.id;
    }

    // Update winner's score
    const updatedStartups = currentTournament.startups.map((startup) => {
      if (startup.id === winnerId) {
        // Se houve empate, adiciona +2 pontos do Shark Fight além do bônus normal
        const sharkBonus = startup1.score === startup2.score ? 2 : 0;
        return { 
          ...startup, 
          score: startup.score + WINNER_BONUS + sharkBonus,
          hadSharkAttack: sharkBonus > 0
        };
      }
      return startup;
    });

    // Update battle
    const updatedBattles = currentTournament.battles.map((b) =>
      b.id === battleId ? { 
        ...b, 
        isCompleted: true, 
        winner: winnerId,
        hadSharkAttack: startup1.score === startup2.score,
        // Atualiza as startups da batalha com suas pontuações atuais
        startup1: updatedStartups.find(s => s.id === b.startup1.id) || b.startup1,
        startup2: updatedStartups.find(s => s.id === b.startup2.id) || b.startup2
      } : b
    );

    // Check if round is complete
    const currentRoundBattles = updatedBattles.filter(b => b.round === currentTournament.currentRound);
    const isRoundComplete = currentRoundBattles.every(b => b.isCompleted);
    
    if (isRoundComplete) {
      // Get winners for next round
      const winners = updatedStartups.filter((s) =>
        currentRoundBattles.some((b) => b.winner === s.id)
      );

      // Determine next round
      const nextRound = currentTournament.currentRound + 1;
      const isTournamentComplete = winners.length === 1;
      
      if (isTournamentComplete) {
        // Cria uma cópia ordenada das startups para determinar as posições
        const sortedStartups = [...updatedStartups].sort((a, b) => {
          // Primeiro critério: número de batalhas vencidas
          const aWins = updatedBattles.filter(b => b.winner === a.id).length;
          const bWins = updatedBattles.filter(b => b.winner === b.id).length;
          if (aWins !== bWins) return bWins - aWins;

          // Segundo critério: pontuação
          return b.score - a.score;
        });

        console.log('Debug - Tournament completion:', {
          winners,
          sortedStartups: sortedStartups.map(s => ({ id: s.id, name: s.name, score: s.score })),
          currentRound: nextRound,
          totalBattles: updatedBattles.length,
          completedBattles: updatedBattles.filter(b => b.isCompleted).length
        });

        // Atualiza o histórico de participações de todas as startups
        const updatedStartupsWithHistory = updatedStartups.map(startup => {
          const position = sortedStartups.findIndex(s => s.id === startup.id) + 1;
          const editionTimestamp = parseInt(currentTournament.id.split('-')[1], 10);

          // Garante que stats existe
          const stats = startup.stats || {
            pitches: 0,
            bugs: 0,
            tractions: 0,
            angryInvestors: 0,
            fakeNews: 0
          };

          const startupEvents = currentTournament.battles
            .filter(b => b.startup1.id === startup.id || b.startup2.id === startup.id)
            .map(battle => {
              const roundPhase: RoundPhase = battle.round === 1 
                ? (currentTournament.startups.length === 4 ? 'SEMI_FINAL' : 'FIRST_ROUND')
                : battle.round === 2 
                  ? (currentTournament.startups.length === 4 ? 'FINAL' : 'SEMI_FINAL')
                  : 'FINAL';

              return (battle.events || [])
                .filter((event: BattleEvent) => event.startupId === startup.id)
                .map((event: BattleEvent): TournamentEvent => ({
                  eventType: event.type,
                  roundPhase,
                  description: `${EventTypeLabels[event.type]} durante a ${
                    roundPhase === 'FIRST_ROUND' ? 'primeira fase' : 
                    roundPhase === 'SEMI_FINAL' ? 'semifinal' : 
                    'final'
                  }`
                }));
            })
            .flat();

          return {
            ...startup,
            stats, // Garante que stats está definido
            participationHistory: [
              ...(startup.participationHistory || []),
              {
                edition: editionTimestamp,
                position,
                score: startup.score,
                finalPitches: stats.pitches,
                finalBugs: stats.bugs,
                finalTractions: stats.tractions,
                finalAngryInvestors: stats.angryInvestors,
                finalFakeNews: stats.fakeNews,
                events: startupEvents
              }
            ]
          };
        });

        // Tournament complete
        set({
          tournament: {
            ...currentTournament,
            startups: updatedStartupsWithHistory,
            battles: updatedBattles,
            isCompleted: true,
            winner: sortedStartups[0],
            currentRound: nextRound
          },
        });
        
        console.log('Tournament completed!', {
          isCompleted: true,
          winner: sortedStartups[0]?.name,
          winnerScore: sortedStartups[0]?.score,
          totalStartups: updatedStartupsWithHistory.length,
          currentRound: nextRound,
          battles: updatedBattles.map(b => ({
            id: b.id,
            round: b.round,
            isCompleted: b.isCompleted,
            winner: b.winner
          }))
        });
      } else {
        // Embaralha os vencedores antes de criar as próximas batalhas
        const shuffledWinners = [...winners].sort(() => Math.random() - 0.5);
        
        // Create next round battles with shuffled winners
        const nextRoundBattles: Battle[] = [];
        for (let i = 0; i < shuffledWinners.length; i += 2) {
          // Encontra as startups atualizadas para a próxima rodada
          const startup1 = updatedStartups.find(s => s.id === shuffledWinners[i].id);
          const startup2 = updatedStartups.find(s => s.id === shuffledWinners[i + 1].id);
          
          nextRoundBattles.push({
            id: `battle-${nextRound}-${i}`,
            round: nextRound,
            startup1: startup1 || shuffledWinners[i],
            startup2: startup2 || shuffledWinners[i + 1],
            isCompleted: false
          });
        }

        set({
          tournament: {
            ...currentTournament,
            startups: updatedStartups,
            battles: [...updatedBattles, ...nextRoundBattles],
            currentRound: nextRound,
          },
        });
      }
    } else {
      set({
        tournament: {
          ...currentTournament,
          startups: updatedStartups,
          battles: updatedBattles,
        },
      });
    }
  },

  addEvent: (battleId, startupId, eventType) => {
    const currentTournament = get().tournament;
    if (!currentTournament) return;

    const battle = currentTournament.battles.find((b) => b.id === battleId);
    if (!battle) return;

    // Adiciona o evento à batalha
    const updatedBattles = currentTournament.battles.map((b) =>
      b.id === battleId
        ? {
            ...b,
            events: [...(b.events || []), { startupId, type: eventType }]
          }
        : b
    );

    // Atualiza as estatísticas da startup
    const updatedStartups = currentTournament.startups.map((startup) => {
      if (startup.id === startupId) {
        const stats = { ...startup.stats };
        switch (eventType) {
          case 'PITCH':
            stats.pitches += 1;
            break;
          case 'BUG':
            stats.bugs += 1;
            break;
          case 'TRACTION':
            stats.tractions += 1;
            break;
          case 'ANGRY_INVESTOR':
            stats.angryInvestors += 1;
            break;
          case 'FAKE_NEWS':
            stats.fakeNews += 1;
            break;
        }

        return {
          ...startup,
          score: startup.score + EventPoints[eventType],
          stats
        };
      }
      return startup;
    });

    set({
      tournament: {
        ...currentTournament,
        startups: updatedStartups,
        battles: updatedBattles,
      },
    });
  },

  getCurrentBattles: () => {
    const currentTournament = get().tournament;
    if (!currentTournament) return [];

    return currentTournament.battles.filter(
      (battle) => battle.round === currentTournament.currentRound && !battle.isCompleted
    );
  },

  getStartupById: (id) => {
    const currentTournament = get().tournament;
    if (!currentTournament) return undefined;

    return currentTournament.startups.find((startup) => startup.id === id);
  },
})); 