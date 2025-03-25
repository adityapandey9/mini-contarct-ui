"use client";

import type React from "react";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import type {
  ConditionType,
  ContractFilters,
  ContractStatus,
} from "@/types/contract";
import { ContractService } from "@/services/contract-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Search, FileText, Trash } from "lucide-react";
import { format } from "date-fns";
import { useTaskScheduler } from "@/hooks/use-task-scheduler";
import { useDebounce } from "@/hooks/use-debounce";
import { useContractStore } from "@/states/contract";

function Contracts() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialStatus = searchParams.get("status") as
    | ContractStatus
    | undefined;
  const initialTitle = searchParams.get("title") || "";
  const initialPage = parseInt(searchParams.get("page") || "1");
  const initialLimit = parseInt(searchParams.get("limit") || "10");

  const [filters, setFilters] = useState<ContractFilters>({
    status: initialStatus,
    title: initialTitle,
    page: initialPage,
    limit: initialLimit,
    condition: "OR",
  });

  const {
    data: contractsData,
    loading,
    refetch,
  } = useTaskScheduler(ContractService.getContracts, [filters]);

  const debouncedReFetch = useDebounce((args?: [ContractFilters]) => {
    refetch(args);
  }, 300);

  const contractsStore = useContractStore((state) => state.contracts);

  const contracts =
    contractsData?.contractsIds
      ?.map((item) => contractsStore[item])
      ?.filter((x): x is NonNullable<typeof x> => x != null) || [];
  const total = contractsData?.total || 0;
  const totalPages = Math.ceil(total / (filters.limit || 10));

  useEffect(() => {
    debouncedReFetch([filters]);

    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.title) params.set("title", filters.title);
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());

    const newUrl = `?${params.toString()}`;
    router.push(`/contracts${newUrl}`, { scroll: false });
  }, [filters, router]);

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value === "all" ? undefined : (value as ContractStatus),
      page: 1,
    }));
  };

  const handleConditionChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      condition: value as ConditionType,
      page: 1,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      title: e.target.value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 10, condition: "OR" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
        <p className="text-muted-foreground">
          View and manage all your contracts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Contracts</CardTitle>
          <CardDescription>
            Search and filter your contracts by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search contracts by titles ${
                  filters?.condition === "AND" ? "&" : "or"
                } parties`}
                className="pl-8"
                value={filters.title || ""}
                onChange={handleSearchChange}
              />
            </div>
            <Select
              value={filters.condition || "OR"}
              onValueChange={handleConditionChange}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Condition" defaultValue="OR" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">Intersect Filters</SelectItem>
                <SelectItem value="OR">Union Filters</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.status || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Finalized">Finalized</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contract List</CardTitle>
          <CardDescription>{total} contracts found</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : contracts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No contracts found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filters, or upload a new contract.
              </p>
              <Link href="/contracts/upload" className="mt-4">
                <Button>Upload Contract</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Parties
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Last Updated
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{contract.title}</span>
                            <span className="text-xs text-muted-foreground md:hidden">
                              {contract?.parties?.join(", ")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              contract.status === "Draft"
                                ? "outline"
                                : "default"
                            }
                          >
                            {contract.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {contract?.parties?.join(", ")}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {format(
                            new Date(contract.updatedAt as string),
                            "MMM d, yyyy"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/contracts/${contract.id}`}>
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </Link>
                            <Link href={`/contracts/${contract.id}/edit`}>
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) =>
                                ContractService.deleteContract(contract.id)
                              }
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-end items-center gap-4 mt-4">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange((filters.page || 1) - 1)}
                  disabled={filters.page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {filters.page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange((filters.page || 1) + 1)}
                  disabled={filters.page === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ContractsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <Contracts />
    </Suspense>
  );
}
