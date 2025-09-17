"use client";

import { useBuyers } from "@/hooks/useBuyer";
import { BuyerForm as BuyerFormType } from "@/lib/validations/buyer";
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
  const [buyer, setBuyer] = useState<BuyerFormType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBuyer, setIsLoadingBuyer] = useState(true);

  // Transform database buyer data to form data format
  const transformToFormData = (dbBuyer: any): BuyerFormType => ({
    fullName: dbBuyer.full_name || "",
    email: dbBuyer.email || "",
    phone: dbBuyer.phone || "",
    city: dbBuyer.city || "Chandigarh",
    propertyType: dbBuyer.property_type || "apartment",
    bhk: dbBuyer.bhk || "",
    purpose: dbBuyer.purpose || "end-use",
    budgetMin: dbBuyer.budget_min || undefined,
    budgetMax: dbBuyer.budget_max || undefined,
    timeline: dbBuyer.timeline || "3-6 months",
    source: dbBuyer.source || "website",
    status: dbBuyer.status || "new",
    notes: dbBuyer.notes || "",
    tags: dbBuyer.tags || [],
  });

  useEffect(() => {
    let isMounted = true;

    const fetchBuyer = async () => {
      if (!id) return;

      try {
        setIsLoadingBuyer(true);
        const buyerData = await getBuyer(id);
        if (isMounted && buyerData) {
          setBuyer(transformToFormData(buyerData));
        }
      } catch (error) {
        console.error("Error fetching buyer:", error);
        toast.error("Failed to load buyer details. Please try again later.");
      } finally {
        if (isMounted) {
          setIsLoadingBuyer(false);
        }
      }
    };

    fetchBuyer();

    return () => {
      isMounted = false;
    };
  }, [id, getBuyer]);

  const handleSubmit = async (data: BuyerFormType) => {
    if (!id) return;

    setIsLoading(true);
    try {
      const buyerData = {
        full_name: data.fullName,
        email: data.email || null,
        phone: data.phone,
        city: data.city,
        property_type: data.propertyType,
        bhk: data.bhk || null,
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
    } catch (error) {
      console.error("Error updating buyer:", error);
      toast.error(
        error instanceof Error
          ? `Failed to update lead: ${error.message}`
          : "Failed to update lead. Please try again."
      );
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
              Update the lead information below
            </p>
          </div>
        </div>

        <div className="max-w-4xl">
          <BuyerForm
            defaultValues={buyer}
            onSubmit={handleSubmit}
            submitText="Update Lead"
            isLoading={isLoading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
