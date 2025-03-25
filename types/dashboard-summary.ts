import { Contract } from "./contract";

interface DashboardStats {
  total: number;
  draft: number;
  finalized: number;
  change: {
    total: number;
    draft: number;
    finalized: number;
  };
}

export interface DashboardSummary {
  stats: DashboardStats;
  recentContractIds?: number[];
  recentContracts?: Contract;
}
