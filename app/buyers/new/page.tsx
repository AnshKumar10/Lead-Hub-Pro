"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useBuyers } from "@/app/hooks/useBuyer";
import { BuyerForm as BuyerFormType } from "@/app/lib/validations/buyer";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Link from "next/link";
import BuyerForm from "@/components/ui/BuyerForm";

export default function BuyerNew() {
  const { createBuyer } = useBuyers();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: BuyerFormType) => {
    setIsLoading(true);
    try {
      // Map form fields to database fields
      const buyerData = {
        full_name: data.fullName, // Map fullName to full_name
        email: data.email || null,
        phone: data.phone,
        city: data.city,
        property_type: data.propertyType, // Map propertyType to property_type
        bhk: data.bhk ? Number(data.bhk) : null,
        purpose: data.purpose,
        budget_min: data.budgetMin || null, // Map budgetMin to budget_min
        budget_max: data.budgetMax || null, // Map budgetMax to budget_max
        timeline: data.timeline,
        source: data.source,
        notes: data.notes || null,
        tags: data.tags || [],
        status: data.status || "new",
      };

      const { error } = await createBuyer(buyerData);

      if (error) {
        throw new Error(error);
      }

      toast.success(
        `New lead for ${data.fullName} has been created successfully.`
      );

      // Use window.location to ensure a full page reload and clear any stale state
      window.location.href = "/buyers";
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error(
        error instanceof Error
          ? `Failed to create lead: ${error.message}`
          : "Failed to create lead. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-3xl font-bold">Create New Lead</h1>
            <p className="text-muted-foreground mt-2">
              Add a new buyer lead to your system
            </p>
          </div>
        </div>

        <div className="max-w-4xl">
          <BuyerForm
            onSubmit={handleSubmit}
            submitText="Create Lead"
            isLoading={isLoading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
