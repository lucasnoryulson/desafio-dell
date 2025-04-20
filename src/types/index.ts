export interface Startup {
  id: string;
  name: string;
  slogan: string;
  description?: string;
  foundingYear: number;
  score: number;
  stats: {
    pitches: number;
    bugs: number;
    tractions: number;
    angryInvestors: number;
    fakeNews: number;
  };
  participationHistory?: ParticipationHistory[];
}

export type EventType = 'PITCH' | 'BUG' | 'TRACTION' | 'ANGRY_INVESTOR' | 'FAKE_NEWS';

export type RoundPhase = 'FIRST_ROUND' | 'SEMI_FINAL' | 'FINAL';

export type BattleEvent = {
  startupId: string;
  type: EventType;
};

export interface Battle {
  id: string;
  round: number;
  startup1: Startup;
  startup2: Startup;
  isCompleted: boolean;
  winner?: string;
  hadSharkAttack?: boolean;
  events?: BattleEvent[];
}

export const EventTypeLabels: Record<EventType, string> = {
  'PITCH': 'Pitch bem sucedido',
  'BUG': 'Bug crítico',
  'TRACTION': 'Ganho de tração',
  'ANGRY_INVESTOR': 'Investidor irritado',
  'FAKE_NEWS': 'Fake News publicada'
};

export const EventTypePoints: Record<EventType, number> = {
  'PITCH': 6,
  'BUG': -4,
  'TRACTION': 3,
  'ANGRY_INVESTOR': -6,
  'FAKE_NEWS': -8
};

export interface Tournament {
  id: string;
  startups: Startup[];
  battles: Battle[];
  currentRound: number;
  isCompleted: boolean;
  winner?: Startup;
}

export interface Event {
  type: EventType;
  points: number;
  description: string;
}

export type TournamentEvent = {
  eventType: EventType;
  roundPhase: RoundPhase;
  description: string;
};

export type ParticipationHistory = {
  edition: number;
  position: number;
  score: number;
  finalPitches: number;
  finalBugs: number;
  finalTractions: number;
  finalAngryInvestors: number;
  finalFakeNews: number;
  events: TournamentEvent[];
}; 