"use client";

import Link from "next/link";
import { ContractService } from "@/services/contract-service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, ArrowLeft, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { useTaskScheduler } from "@/hooks/use-task-scheduler";
import { use } from "react";
import { useContractStore } from "@/states/contract";

export default function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = use(params);

  const { data: contractId, loading } = useTaskScheduler(
    ContractService.getContractById,
    [id]
  );

  const contract = useContractStore((state) =>
    contractId ? state.contracts[contractId] : undefined
  );

  // Function to try parsing JSON content
  const renderContent = (content: string) => {
    try {
      const parsedContent = JSON.parse(content);
      return (
        <div className="space-y-4">
          <pre className="p-4 bg-muted rounded-md overflow-auto whitespace-pre-wrap">
            {JSON.stringify(parsedContent, null, 2)}
          </pre>
        </div>
      );
    } catch (e) {
      // If not valid JSON, render as plain text
      return (
        <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
          {content}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Contract not found</h2>
        <Button asChild>
          <Link href="/contracts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contracts
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/contracts"
          className="text-muted-foreground hover:text-foreground flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contracts
        </Link>
        <Link href={`/contracts/${contract.id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Contract
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {contract.title}
          </h1>
          <Badge variant={contract.status === "Draft" ? "outline" : "default"}>
            {contract.status}
          </Badge>
        </div>
        <p className="text-muted-foreground">{contract.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="text-sm font-medium">Created</div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(contract.createdAt as string), "PPP")}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Last Updated</div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(contract.updatedAt as string), "PPP")}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Parties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {contract?.parties?.map((party, index) => (
                <li key={index} className="text-sm">
                  {party}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contract Content</CardTitle>
          <CardDescription>Full content of the contract</CardDescription>
        </CardHeader>
        <CardContent>{renderContent(contract?.content as string)}</CardContent>
      </Card>
    </div>
  );
}
