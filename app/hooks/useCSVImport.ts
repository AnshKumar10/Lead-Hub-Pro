import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";

interface CSVImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
    data: any;
  }>;
}

export function useCSVImport() {
  const [importing, setImporting] = useState(false);
  const { user } = useAuth();

  const validateRow = (row: any, rowIndex: number) => {
    const errors: Array<{ field: string; message: string }> = [];

    // Required fields validation
    if (!row.full_name?.trim()) {
      errors.push({ field: "full_name", message: "Full name is required" });
    }

    if (!row.phone?.trim()) {
      errors.push({ field: "phone", message: "Phone is required" });
    }

    if (!row.city?.trim()) {
      errors.push({ field: "city", message: "City is required" });
    }

    // Email validation
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push({ field: "email", message: "Invalid email format" });
    }

    // Phone validation
    if (row.phone && !/^\d{10}$/.test(row.phone.replace(/\D/g, ""))) {
      errors.push({ field: "phone", message: "Phone must be 10 digits" });
    }

    // Property type validation
    const validPropertyTypes = [
      "apartment",
      "villa",
      "plot",
      "office",
      "shop",
      "warehouse",
    ];
    if (
      !row.property_type ||
      !validPropertyTypes.includes(row.property_type.toLowerCase())
    ) {
      errors.push({
        field: "property_type",
        message: `Property type must be one of: ${validPropertyTypes.join(
          ", "
        )}`,
      });
    }

    // Purpose validation
    const validPurposes = ["investment", "end-use"];
    if (!row.purpose || !validPurposes.includes(row.purpose.toLowerCase())) {
      errors.push({
        field: "purpose",
        message: `Purpose must be one of: ${validPurposes.join(", ")}`,
      });
    }

    // Timeline validation
    const validTimelines = [
      "immediate",
      "1-3 months",
      "3-6 months",
      "6+ months",
    ];
    if (!row.timeline || !validTimelines.includes(row.timeline.toLowerCase())) {
      errors.push({
        field: "timeline",
        message: `Timeline must be one of: ${validTimelines.join(", ")}`,
      });
    }

    // Source validation
    const validSources = [
      "website",
      "referral",
      "social media",
      "advertisement",
      "walk-in",
      "phone",
      "other",
    ];
    if (!row.source || !validSources.includes(row.source.toLowerCase())) {
      errors.push({
        field: "source",
        message: `Source must be one of: ${validSources.join(", ")}`,
      });
    }

    // Budget validation
    if (row.budget_min && isNaN(Number(row.budget_min))) {
      errors.push({
        field: "budget_min",
        message: "Budget min must be a number",
      });
    }

    if (row.budget_max && isNaN(Number(row.budget_max))) {
      errors.push({
        field: "budget_max",
        message: "Budget max must be a number",
      });
    }

    if (
      row.budget_min &&
      row.budget_max &&
      Number(row.budget_min) > Number(row.budget_max)
    ) {
      errors.push({
        field: "budget_max",
        message: "Budget max must be greater than budget min",
      });
    }

    // BHK validation for specific property types
    if (
      ["apartment", "villa"].includes(row.property_type?.toLowerCase()) &&
      (!row.bhk || isNaN(Number(row.bhk)))
    ) {
      errors.push({
        field: "bhk",
        message: `BHK is required for ${row.property_type}`,
      });
    }

    return errors;
  };

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0]
      .split(",")
      .map((header) => header.trim().toLowerCase().replace(/\s+/g, "_"));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i]
        .split(",")
        .map((value) => value.trim().replace(/^"|"$/g, ""));
      const row: any = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      rows.push(row);
    }

    return rows;
  };

  const importCSV = async (file: File): Promise<CSVImportResult> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    setImporting(true);

    try {
      const csvText = await file.text();
      const rows = parseCSV(csvText);

      const result: CSVImportResult = {
        success: 0,
        failed: 0,
        errors: [],
      };

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowIndex = i + 2; // +2 because we skip header and array is 0-indexed

        const validationErrors = validateRow(row, rowIndex);

        if (validationErrors.length > 0) {
          result.failed++;
          validationErrors.forEach((error) => {
            result.errors.push({
              row: rowIndex,
              field: error.field,
              message: error.message,
              data: row,
            });
          });
          continue;
        }

        try {
          // Transform and prepare data for insertion
          const buyerData = {
            user_id: user.id,
            full_name: row.full_name.trim(),
            email: row.email?.trim() || null,
            phone: row.phone.trim(),
            city: row.city.trim(),
            property_type: row.property_type.toLowerCase(),
            bhk: row.bhk ? Number(row.bhk) : null,
            purpose: row.purpose.toLowerCase(),
            budget_min: row.budget_min ? Number(row.budget_min) : null,
            budget_max: row.budget_max ? Number(row.budget_max) : null,
            timeline: row.timeline.toLowerCase(),
            source: row.source.toLowerCase(),
            notes: row.notes?.trim() || null,
            tags: row.tags
              ? row.tags
                  .split(";")
                  .map((tag: string) => tag.trim())
                  .filter(Boolean)
              : [],
            status: row.status?.toLowerCase() || "new",
          };

          const { error } = await supabase.from("buyers").insert(buyerData);

          if (error) {
            throw error;
          }

          result.success++;
        } catch (error) {
          result.failed++;
          result.errors.push({
            row: rowIndex,
            field: "database",
            message:
              error instanceof Error ? error.message : "Database insert failed",
            data: row,
          });
        }
      }

      toast.info(
        `Successfully imported ${result.success} leads. ${result.failed} failed.`
      );

      return result;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "CSV import failed");
      throw error;
    } finally {
      setImporting(false);
    }
  };

  const generateTemplate = (): string => {
    const headers = [
      "full_name",
      "email",
      "phone",
      "city",
      "property_type",
      "bhk",
      "purpose",
      "budget_min",
      "budget_max",
      "timeline",
      "source",
      "notes",
      "tags",
      "status",
    ];

    const sampleData = [
      [
        "John Doe",
        "john@email.com",
        "9876543210",
        "Chandigarh",
        "apartment",
        "3",
        "investment",
        "5000000",
        "7000000",
        "1-3 months",
        "website",
        "Looking for modern apartment",
        "urgent;premium",
        "new",
      ],
      [
        "Jane Smith",
        "jane.smith@gmail.com",
        "9123456789",
        "Mohali",
        "villa",
        "4",
        "end-use",
        "8000000",
        "12000000",
        "immediate",
        "referral",
        "Family of 4 needs spacious villa",
        "family;spacious",
        "interested",
      ],
      [
        "Rajesh Kumar",
        "rajesh.k@yahoo.com",
        "9988776655",
        "Panchkula",
        "plot",
        "",
        "investment",
        "2000000",
        "3000000",
        "3-6 months",
        "social media",
        "Looking for plot in good location",
        "investment;commercial",
        "new",
      ],
      [
        "Priya Sharma",
        "priya.sharma@outlook.com",
        "9876123456",
        "Zirakpur",
        "apartment",
        "2",
        "end-use",
        "3500000",
        "4500000",
        "1-3 months",
        "advertisement",
        "First time buyer",
        "first-time;urgent",
        "qualified",
      ],
      [
        "Amit Singh",
        "",
        "9654321098",
        "Kharar",
        "office",
        "",
        "investment",
        "1500000",
        "2500000",
        "6+ months",
        "walk-in",
        "Small office space needed",
        "office;small",
        "new",
      ],
    ];

    const csvRows = [headers.join(",")];
    sampleData.forEach((row) => {
      csvRows.push(row.map((field) => `"${field}"`).join(","));
    });

    return csvRows.join("\n");
  };

  return {
    importing,
    importCSV,
    generateTemplate,
  };
}
