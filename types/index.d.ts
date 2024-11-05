import { Timestamp } from "firebase/firestore";

export interface ProfileData {
  id: string;
  uid: string;
  photoURL: string;
  displayName: string;
  elo: number;
  online: boolean;
  config: {
    boardTheme: {
      set: string;
      theme: number;
    };
    chat: boolean;
    sound: boolean;
  };
  email: string;
  referred: string;
  pin: string;
  statistics: {
    loses: number;
    win: number;
  };
  createdAt: Timestamp;
  seeds: number;
}

export interface InvoiceData {
  id: string;
  amount: number;
  statusUrl: string;
  seedAmount: number;
  confirmations: number;
  timeout: number;
  currentAddress: string;
  checkoutUrl: string;
  createdAt: Timestamp;
  profileId: string;
  currentCurrency: string;
  txnId: string;
  status: string;
  qrcodeUrl: string;
}

export interface GameHistory {
  san: string;
  color: string;
  piece: string;
  before: string;
  flags: string;
  lan: string;
  from: string;
  to: string;
  after: string;
  time: string;
}

interface PlayerProfile {
  uid: string;
  photoURL: string | null;
  displayName: string;
  elo: number;
  email: string;
  statistics: {
    loses: number;
    win: number;
  };
}

interface Player {
  socketId?: string;
  side: string;
  profile: PlayerProfile;
  currenTime: number;
}

interface Game {
  turn: string;
  currentFen: string;
  history: GameHistory[];
}

export interface RoomData {
  id: string;
  bet: number;
  timer: number;
  createdBy: string;
  createdAt: Timestamp;
  chat: object;
  roomId: string;
  startAt: Timestamp;
  game: Game;
  winner: string;
  gameOverReason: string;
  players: {
    b: Player;
    w: Player;
  };
  private: boolean;
  finishAt: Timestamp;
}

export interface Activity {
  action: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  email: string;
  profileId: string;
}

export interface ActivitiesType extends Omit<Activity, "createdAt"> {
  createdAt: string;
}

export interface TimestampType {
  _seconds: number;
  _nanoseconds: number;
}

export interface RoomsReports {
  boardSide: string;
  roomId: string;
  text: string;
  type: string;
}

export interface ReportsData {
  id: string;
  type: string;
  amount: number;
  category: string;
  createdAt: TimestampType;
  description: string;
  userId: string;
}

export interface Role {
  createdAt: Timestamp;
  role: string;
  id: string;
}

export interface Permission {
  createdAt: Timestamp;
  email: string;
  pages: string[];
  role: string;
  userId: string;
}

interface Referral {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
  referrals: {
    id: string;
    photoURL: string;
    displayName: string;
    email: string;
    status: string;
    online: boolean;
    amount: number;
    createdAt: Timestamp;
  }[];
}
