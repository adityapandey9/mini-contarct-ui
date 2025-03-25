"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ContractService } from "@/services/contract-service";
import type { Contract, ContractStatus } from "@/types/contract";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { showError } from "@/states/error";

export default function UploadContractPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [fileContent, setFileContent] = useState("");
  const [fileError, setFileError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Draft" as ContractStatus,
    parties: "",
    content: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as ContractStatus }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];

    if (!file) return;

    // Check file type
    if (!file.name.endsWith(".json") && !file.name.endsWith(".txt")) {
      setFileError("Only JSON and TXT files are supported");
      return;
    }

    const newContract = await ContractService.uploadContract(file);

    if (newContract) {
      showError({
        title: "Contract Uploaded",
        description: "Your contract has been successfully uploaded",
      });

      // Redirect to the contract list
      router.push("/contracts");
    } else {
      e.target.value = "";
    }
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
      const contractData: Omit<Contract, "id" | "created_at" | "updated_at"> = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        parties: formData.parties
          .split(",")
          .map((party) => party.trim())
          .filter(Boolean),
        content: formData.content,
      };

      const newContract = await ContractService.createContract(contractData);

      if (newContract) {
        showError({
          title: "Contract Uploaded",
          description: "Your contract has been successfully uploaded",
        });

        // Redirect to the contract list
        router.push("/contracts");
      }
    } catch (error) {
      console.error("Error uploading contract:", error);
      showError({
        title: "Upload Failed",
        description: "There was an error uploading your contract",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Upload Contract</h1>
        <p className="text-muted-foreground">
          Upload a new contract in text or JSON format
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload File</TabsTrigger>
          <TabsTrigger value="form">Contract Details</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Contract File</CardTitle>
              <CardDescription>
                Upload a contract file in JSON or text format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12">
                <Upload className="h-8 w-8 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Upload Contract File</h3>
                <p className="text-sm text-muted-foreground text-center mt-2 mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <Input
                  type="file"
                  accept=".json,.txt"
                  onChange={handleFileUpload}
                  className="max-w-xs"
                />
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: JSON, TXT
                </p>
              </div>

              {fileError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{fileError}</AlertDescription>
                </Alert>
              )}

              {fileContent && (
                <div className="mt-4">
                  <Label>File Content Preview</Label>
                  <div className="mt-2 p-4 bg-muted rounded-md overflow-auto max-h-[300px]">
                    <pre className="text-xs">{fileContent}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
                <CardDescription>
                  Enter the details of your contract
                </CardDescription>
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
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/contracts")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Uploading..." : "Upload Contract"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
