export type ContractStatus = "Draft" | "Finalized";

export type ConditionType = "AND" | "OR";

export interface Contract {
  id: number;
  title: string;
  description?: string;
  status: ContractStatus;
  parties?: string[];
  created_at?: string;
  updated_at: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContractFilters {
  status?: ContractStatus;
  party?: string;
  condition?: ConditionType;
  title?: string;
  page?: number;
  limit?: number;
}

export interface ContractsState {
  contracts: { [key: number]: Contract };
  addOrUpdateContract: (contract: Contract) => void;
  removeContract: (contractId: number) => void;
  removeAllContracts: () => void;
  addContracts: (contracts: Contract[]) => void;
}
