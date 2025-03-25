"use client";

import type React from "react";

import { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ContractService } from "@/services/contract-service";
import type { ContractStatus } from "@/types/contract";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { showError } from "@/states/error";
import { useTaskScheduler } from "@/hooks/use-task-scheduler";
import { removeAllContracts, useContractStore } from "@/states/contract";

export default function EditContractPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = use(params);

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isContractStored = useRef("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Draft" as ContractStatus,
    parties: "",
    content: "",
  });

  const { data: contractId, loading } = useTaskScheduler(
    ContractService.getContractById,
    [id]
  );

  const contract = useContractStore((state) =>
    contractId ? state.contracts[contractId] : undefined
  );

  useEffect(() => {
    if (
      contract &&
      contract.updatedAt &&
      isContractStored.current !== contract.updatedAt
    ) {
      isContractStored.current = contract.updatedAt;
      setFormData({
        title: contract.title,
        description: contract?.description ?? "",
        status: contract.status,
        parties: contract?.parties?.join(", ") ?? "",
        content: contract?.content ?? "",
      });
    }
  }, [contract]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    if (!["Draft", "Finalized"].includes(value)) {
      return;
    }
    setFormData((prev) => ({ ...prev, status: value as ContractStatus }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      showError({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const contractData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        parties: formData.parties
          .split(",")
          .map((party) => party.trim())
          .filter(Boolean),
        content: formData.content,
      };

      const isUpdated = await ContractService.updateContract(id, contractData);

      if (isUpdated) {
        showError({
          title: "Contract Updated",
          description: "Your contract has been successfully updated",
          variant: "success",
        });

        // Redirect to the contract detail page
        router.push(`/contracts/${id}`);
      }
    } catch (error) {
      console.error("Error updating contract:", error);
      showError({
        title: "Update Failed",
        description: "There was an error updating your contract",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!contract && !loading) {
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
          href={`/contracts/${id}`}
          className="text-muted-foreground hover:text-foreground flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contract
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Edit Contract</h1>
        <p className="text-muted-foreground">
          Update the details of your contract
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
            <CardDescription>Edit the details of your contract</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter contract title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter contract description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Finalized">Finalized</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parties">Parties</Label>
              <Input
                id="parties"
                name="parties"
                value={formData.parties}
                onChange={handleInputChange}
                placeholder="Enter parties (comma separated)"
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple parties with commas
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contract Content *</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Enter contract content or paste JSON"
                rows={10}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href={`/contracts/${id}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
