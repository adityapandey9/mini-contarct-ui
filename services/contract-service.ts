import { addContracts } from "@/states/contract";
import { showError } from "@/states/error";
import type { Contract, ContractFilters } from "@/types/contract";
import { DashboardSummary } from "@/types/dashboard-summary";
import { APIResponse } from "@/types/utils";

const API_ORIGIN = "https://mini-contract-api.fly.dev";

export const getDashboardSummary = async (): Promise<
  APIResponse<DashboardSummary>
> => {
  try {
    const res = await fetch(`${API_ORIGIN}/dashboard-summary`);

    if (!res.ok) {
      showError({ title: "Failed to fetch dashboard data", description: "" });
      return null;
    }

    const dashboardSummary = await res.json();

    const recentContracts = dashboardSummary?.["recentContracts"];

    if (Array.isArray(recentContracts) && recentContracts.length > 0) {
      addContracts(recentContracts);
      dashboardSummary["recentContractIds"] = recentContracts.map(
        (item) => item.id
      );
      delete dashboardSummary?.["recentContracts"];
    }

    return dashboardSummary;
  } catch (e) {
    showError({
      title:
        "Something went wrong while loading Dashboard data. Please try again.",
      description: "",
    });
    return null;
  }
};

export const ContractService = {
  // Get all contracts with optional filtering
  async getContracts({
    status,
    title,
    condition,
    page = 1,
    limit = 10,
  }: ContractFilters): Promise<
    APIResponse<{
      total: number;
      contractsIds: number[];
    }>
  > {
    try {
      const queries: ContractFilters = {};

      if (status) queries["status"] = status;

      if (title) {
        queries.title = title;
        queries.party = title;
      }

      if (condition) queries.condition = condition;

      if (page) queries.page = page;

      queries.limit = 10;

      const filterQuery = new URLSearchParams(
        queries as unknown as Record<string, string>
      );
      const res = await fetch(
        `${API_ORIGIN}/contracts?${filterQuery.toString()}`
      );

      if (!res.ok) {
        showError({ title: "Failed to fetch contracts", description: "" });
        return null;
      }

      const filteredContracts = await res.json();

      const contracts = filteredContracts?.["contracts"];

      if (Array.isArray(contracts) && contracts.length > 0) {
        addContracts(contracts);
        filteredContracts["contractsIds"] = contracts.map((item) => item.id);
        delete filteredContracts?.["contracts"];
      }

      return filteredContracts;
    } catch (e) {
      showError({
        title:
          "Something went wrong while loading contracts. Please try again.",
        description: "",
      });
      return null;
    }
  },

  // Get a single contract by ID
  async getContractById(id: number): Promise<APIResponse<number>> {
    try {
      const res = await fetch(`${API_ORIGIN}/contracts?id=${id}`);

      if (!res.ok) {
        showError({
          title: "Failed to fetch contracts",
          description: "",
        });
        return null;
      }

      const filteredContractById = await res.json();

      if (
        Array.isArray(filteredContractById["contracts"]) &&
        filteredContractById["contracts"]?.length > 0
      ) {
        addContracts(filteredContractById["contracts"]);
        return filteredContractById["contracts"][0]?.id;
      }

      return null;
    } catch (e) {
      showError({
        title: "Something went wrong while loading contract. Please try again.",
        description: "",
      });
      return null;
    }
  },

  // Create a new contract
  async createContract(
    contractData: Omit<Contract, "id" | "created_at" | "updated_at">
  ): Promise<APIResponse<Contract>> {
    try {
      const res = await fetch(`${API_ORIGIN}/contracts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(contractData),
      });

      if (!res.ok) {
        showError({
          title: "Failed to create a new contract",
          description: "",
        });
        return null;
      }

      const newContract = await res.json();

      return newContract;
    } catch (e) {
      showError({
        title:
          "Something went wrong while creating a new contract. Please try again.",
        description: "",
      });
      return null;
    }
  },

  // Create a new contract
  async uploadContract(file: File): Promise<APIResponse<Contract>> {
    try {
      const formData = new FormData();
      formData.append("file", file, file.name); // Automatically sets MIME type

      const res = await fetch(`${API_ORIGIN}/contracts/upload`, {
        method: "POST",
        headers: {
          Accept: "*/*",
        },
        body: formData,
      });

      if (!res.ok) {
        showError({
          title: "Failed to create a new contract",
          description: "",
        });
        return null;
      }

      const newContract = await res.json();

      return newContract;
    } catch (e) {
      showError({
        title:
          "Something went wrong while creating a new contract. Please try again.",
        description: "",
      });
      return null;
    }
  },

  // Update an existing contract
  async updateContract(
    id: number,
    contractData: Partial<Omit<Contract, "id" | "createdAt" | "updatedAt">>
  ): Promise<APIResponse<Contract>> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    try {
      const res = await fetch(`${API_ORIGIN}/contracts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(contractData),
      });

      if (!res.ok) {
        showError({
          title: "Failed to update the contract",
          description: "",
        });
        return null;
      }

      const newContract = await res.json();

      return newContract;
    } catch (e) {
      showError({
        title:
          "Something went wrong while updating the contract. Please try again.",
        description: "",
      });
      return null;
    }
  },

  // Delete an existing contract
  async deleteContract(id: number): Promise<APIResponse<Contract>> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    try {
      const res = await fetch(`${API_ORIGIN}/contracts/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        method: "DELETE",
      });

      if (!res.ok) {
        showError({
          title: "Failed to delete the contract",
          description: "",
        });
        return null;
      }

      const newContract = await res.json();

      return newContract?.["deleted"]?.["id"];
    } catch (e) {
      showError({
        title:
          "Something went wrong while deleting the contract. Please try again.",
        description: "",
      });
      return null;
    }
  },
};
