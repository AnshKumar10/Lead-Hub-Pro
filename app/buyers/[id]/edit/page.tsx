"use client";

import { useBuyers } from "@/app/hooks/useBuyer";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import BuyerForm from "@/components/ui/BuyerForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BuyerEdit() {
  const { id } = useParams<{ id: string }>();

  const { getBuyer, updateBuyer } = useBuyers();
  const [buyer, setBuyer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBuyer, setIsLoadingBuyer] = useState(true);

  useEffect(() => {
    const fetchBuyer = async () => {
      if (!id) return;

      try {
        const buyerData = await getBuyer(id);
        setBuyer(buyerData);
      } catch (error) {
        toast.error("Failed to load buyer details.");
      } finally {
        setIsLoadingBuyer(false);
      }
    };

    fetchBuyer();
  }, [id, getBuyer, toast]);

  const handleSubmit = async (data: BuyerFormType) => {
    if (!id) return;

    setIsLoading(true);
    try {
      // Map form fields to database fields
      const buyerData = {
        full_name: data.fullName,
        email: data.email || null,
        phone: data.phone,
        city: data.city,
        property_type: data.propertyType,
        bhk: data.bhk ? Number(data.bhk) : null,
        purpose: data.purpose,
        budget_min: data.budgetMin || null,
        budget_max: data.budgetMax || null,
        timeline: data.timeline,
        source: data.source,
        notes: data.notes || null,
        tags: data.tags || [],
        status: data.status || "new",
      };

      await updateBuyer(id, buyerData);

      toast.success(`Lead for ${data.fullName} has been updated successfully.`);

      redirect("/buyers");
    } catch {
      toast.error("Failed to update lead. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingBuyer) {
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
              <h1 className="text-3xl font-bold">Edit Lead</h1>
              <p className="text-muted-foreground mt-2">Loading...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!buyer) {
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
              <h1 className="text-3xl font-bold">Lead Not Found</h1>
              <p className="text-muted-foreground mt-2">
                The requested lead could not be found.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Map database fields to form fields
  const defaultValues = {
    fullName: buyer.full_name,
    email: buyer.email || "",
    phone: buyer.phone,
    city: buyer.city,
    propertyType: buyer.property_type,
    bhk: buyer.bhk
      ? (buyer.bhk.toString() as "1" | "2" | "3" | "4" | "5")
      : undefined,
    purpose: buyer.purpose,
    budgetMin: buyer.budget_min || undefined,
    budgetMax: buyer.budget_max || undefined,
    timeline: buyer.timeline,
    source: buyer.source,
    notes: buyer.notes || "",
    tags: buyer.tags || [],
    status: buyer.status,
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
            <h1 className="text-3xl font-bold">Edit Lead</h1>
            <p className="text-muted-foreground mt-2">
              Update lead information for {buyer.full_name}
            </p>
          </div>
        </div>

        <div className="max-w-4xl">
          <BuyerForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            submitText="Update Lead"
            isLoading={isLoading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
