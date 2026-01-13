
export type Golongan = 'II/a' | 'II/b' | 'II/c' | 'II/d' | 'III/a' | 'III/b' | 'III/c' | 'III/d' | 'IV/a' | 'IV/b' | 'IV/c' | 'IV/d';

export interface User {
  id: string;
  fullName: string;
  username: string;
  password?: string;
  jabatan: string;
  golongan: Golongan;
}

export interface Activity {
  id: string;
  name: string;
  timeRange: string;
  description: string;
  output: string;
  evidence: string;
}

export interface ReportData {
  daily: Activity[];
  weeklyRecap: string;
  weeklySummary: string;
  monthlyRecap: string;
  monthlySummary: string;
}

export type ReportType = 'daily' | 'weekly' | 'monthly' | 'all';
