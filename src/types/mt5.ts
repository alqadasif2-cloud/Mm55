export interface Account {
  id: string;
  name: string;
  broker: string;
  server: string;
  accountNumber: string;
  balance: number;
  currency: string;
  type: 'real' | 'demo';
  leverage: string;
  logoType: 'exness' | 'metaquotes';
  equity?: number;
  margin?: number;
  freeMargin?: number;
  lastKnownLabel?: string;
  isPartial?: boolean;
}

export interface SymbolQuote {
  symbol: string;
  name: string;
  digits: number;
  bid: number;
  ask: number;
  spread: number;
  high: number;
  low: number;
  time: string;
  change: number; // percentage change
  tickDirection?: 'up' | 'down' | 'none';
  category: 'forex' | 'crypto' | 'metals' | 'indices' | 'commodities';
  source?: string;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Position {
  id: string;
  ticket: number;
  symbol: string;
  type: 'buy' | 'sell';
  lots: number;
  openPrice: number;
  currentPrice: number;
  sl?: number;
  tp?: number;
  swap: number;
  commission: number;
  profit: number;
  openTime: string;
}

export interface Deal {
  id: string;
  ticket: number;
  symbol: string;
  type: 'buy' | 'sell' | 'deposit';
  lots: number;
  openPrice: number;
  closePrice: number;
  sl?: number;
  tp?: number;
  swap: number;
  commission: number;
  profit: number;
  openTime: string;
  closeTime: string;
  accountId?: string;
  comment?: string;
}

export interface MessageItem {
  id: string;
  title: string;
  content: string;
  sender: string;
  time: string;
  read: boolean;
  type: 'security' | 'system' | 'news';
}

export type TabType = 'quotes' | 'chart' | 'trade' | 'history' | 'messages' | 'accounts';
export type Timeframe = 'M1' | 'M5' | 'M15' | 'M30' | 'H1' | 'H4' | 'D1' | 'W1' | 'MN';
