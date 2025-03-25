"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FilePlus, FileCheck } from "lucide-react";
import { getDashboardSummary } from "@/services/contract-service";
import { useTaskScheduler } from "@/hooks/use-task-scheduler";
import { useContractStore } from "@/states/contract";
import { timeAgo } from "@/lib/utils";

export default function Dashboard() {
  const { data: dashboardSummary } = useTaskScheduler(getDashboardSummary);

  const contracts = useContractStore((state) => state.contracts);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your contract management dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contracts
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardSummary?.stats?.total ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {(dashboardSummary?.stats?.change?.total &&
                (dashboardSummary?.stats?.change?.total > 0
                  ? `+${dashboardSummary?.stats?.change?.total}`
                  : `-${dashboardSummary?.stats?.change?.total}`)) ??
                0}{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Draft Contracts
            </CardTitle>
            <FilePlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardSummary?.stats?.draft ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {(dashboardSummary?.stats?.change?.draft &&
                (dashboardSummary?.stats?.change?.draft > 0
                  ? `+${dashboardSummary?.stats?.change?.draft}`
                  : `-${dashboardSummary?.stats?.change?.draft}`)) ??
                0}{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Finalized Contracts
            </CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardSummary?.stats?.finalized ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {(dashboardSummary?.stats?.change?.finalized &&
                (dashboardSummary?.stats?.change?.finalized > 0
                  ? `+${dashboardSummary?.stats?.change?.finalized}`
                  : `-${dashboardSummary?.stats?.change?.finalized}`)) ??
                0}{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Contracts</CardTitle>
            <CardDescription>
              Your most recently updated contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardSummary?.recentContractIds?.map((contractId) => {
                const contract = contracts[contractId];
                return (
                  <div
                    key={contract.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {contract.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {timeAgo(contract.updated_at)}
                      </p>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        contract.status === "Draft"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      }`}
                    >
                      {contract.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/contracts">
              <Button variant="outline" size="sm">
                View all contracts
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/contracts/upload">
              <Button className="w-full justify-start" variant="outline">
                <FilePlus className="mr-2 h-4 w-4" />
                Upload New Contract
              </Button>
            </Link>
            <Link href="/contracts?status=Draft">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View Draft Contracts
              </Button>
            </Link>
            <Link href="/contracts?status=Finalized">
              <Button className="w-full justify-start" variant="outline">
                <FileCheck className="mr-2 h-4 w-4" />
                View Finalized Contracts
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
