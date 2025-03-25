import { Contract, ContractsState } from "@/types/contract";
import { create } from "zustand";

export const useContractStore = create<ContractsState>((set) => ({
  contracts: {},
  addOrUpdateContract: (contract: Contract) =>
    set((state) => ({
      contracts: {
        ...state.contracts,
        [contract.id]: contract,
      },
    })),
  removeContract: (contractId: number) =>
    set((state) => {
      const updated = { ...state.contracts };
      delete updated[contractId];
      return { contracts: updated };
    }),
  addContracts: (contracts: Contract[]) =>
    set((state) => {
      const updated = { ...state.contracts };
      contracts.forEach((item) => {
        updated[item.id] = item;
      });
      return { contracts: updated };
    }),
  removeAllContracts: () => set(() => ({ contracts: {} })),
}));

export const {
  addOrUpdateContract,
  removeContract,
  addContracts,
  removeAllContracts,
} = useContractStore.getState();
