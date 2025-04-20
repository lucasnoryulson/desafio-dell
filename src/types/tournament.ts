export interface Battle {
  id: string;
  round: number;
  startup1: string;
  startup2: string;
  isCompleted: boolean;
  winner?: string;
  hadSharkAttack?: boolean;
} 