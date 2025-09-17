"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Link from "next/link";
import { useCSVImport } from "@/hooks/useCSVImport";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BuyerImport() {
  const { importing, importCSV, generateTemplate } = useCSVImport();
  const [file, setFile] = useState<File | null>(null);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    errors: Array<{
      row: number;
      field: string;
      message: string;
      data: any;
    }>;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setImportResults(null);
    } else {
      toast.error("Please select a valid CSV file.");
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      const results = await importCSV(file);
      setImportResults(results);

      if (results.errors.length > 0) {
        toast.error(
          `${results.success} leads imported successfully, ${results.failed} failed. Please review errors below.`
        );
      } else {
        toast.success(`Successfully imported ${results.success} leads.`);
      }
    } catch {
      toast.error("Please check your CSV format and try again.");
    }
  };

  const downloadTemplate = () => {
    const csvContent = generateTemplate();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "buyer-leads-template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.info("CSV template has been downloaded to your device.");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/buyers">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Leads
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Import Buyer Leads</h1>
            <p className="text-muted-foreground mt-2">
              Upload a CSV file to import multiple buyer leads at once
            </p>
          </div>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                Import Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">CSV Format Requirements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Maximum 200 rows per import</li>
                    <li>• UTF-8 encoding required</li>
                    <li>• Use comma (,) as delimiter</li>
                    <li>• Wrap fields with commas in quotes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Required Fields</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• fullName (2-80 characters)</li>
                    <li>• phone (10-15 digits)</li>
                    <li>• city, propertyType, purpose</li>
                    <li>• timeline, source</li>
                  </ul>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  BHK is required for Apartment and Villa property types. Budget
                  fields should be numbers without currency symbols.
                </AlertDescription>
              </Alert>

              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="w-4 h-4 mr-2" />
                Download CSV Template
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload CSV File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="csvFile">Select CSV File</Label>
                <Input
                  id="csvFile"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </div>

              {file && (
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <FileSpreadsheet className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleImport} disabled={importing}>
                      {importing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Import Leads
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFile(null)}
                      disabled={importing}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Import Results */}
          {importResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Import Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium">Successfully Imported</p>
                      <p className="text-sm text-muted-foreground">
                        {importResults.success} leads
                      </p>
                    </div>
                  </div>

                  {importResults.failed > 0 && (
                    <div className="flex items-center space-x-3 p-3 border rounded-lg bg-red-50 dark:bg-red-950/20">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium">Failed Imports</p>
                        <p className="text-sm text-muted-foreground">
                          {importResults.failed} rows with errors
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {importResults.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Error Details</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Please fix these errors in your CSV file and try importing
                      again.
                    </p>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {importResults.errors.map((error, index) => (
                        <div
                          key={index}
                          className="text-sm p-3 border rounded bg-red-50 dark:bg-red-950/20"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-medium text-red-700 dark:text-red-400">
                                Row {error.row} - {error.field}:
                              </span>
                              <p className="text-red-600 dark:text-red-300 mt-1">
                                {error.message}
                              </p>
                              {error.data && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Data:{" "}
                                  {JSON.stringify(error.data).slice(0, 100)}...
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button asChild>
                    <Link href="/buyers">View Imported Leads</Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFile(null);
                      setImportResults(null);
                    }}
                  >
                    Import Another File
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
