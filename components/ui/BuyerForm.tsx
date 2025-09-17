import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";
import { BuyerFormSchema } from "@/lib/validations/buyer";
import { BuyerForm as BuyerFormType } from "@/lib/validations/buyer";

interface BuyerFormProps {
  defaultValues?: Partial<BuyerFormType>;
  onSubmit: (data: BuyerFormType) => void;
  isLoading?: boolean;
  submitText?: string;
}

export default function BuyerForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitText = "Save Lead",
}: BuyerFormProps) {
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BuyerFormType>({
    resolver: zodResolver(BuyerFormSchema),
    defaultValues: {
      fullName: defaultValues?.fullName || "",
      email: defaultValues?.email || "",
      phone: defaultValues?.phone || "",
      city: defaultValues?.city || "Chandigarh",
      propertyType: defaultValues?.propertyType || "apartment",
      bhk: defaultValues?.bhk,
      purpose: defaultValues?.purpose || "end-use",
      budgetMin: defaultValues?.budgetMin,
      budgetMax: defaultValues?.budgetMax,
      timeline: defaultValues?.timeline || "3-6 months",
      source: defaultValues?.source || "website",
      status: defaultValues?.status || "new",
      notes: defaultValues?.notes || "",
      tags: defaultValues?.tags || [],
    },
  });

  const propertyType = watch("propertyType");
  const tags = watch("tags") || [];

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue("tags", [...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-xl font-semibold">
          Lead Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
          noValidate
        >
          {/* Personal Information */}
          <fieldset className="space-y-6">
            <legend className="text-lg font-medium mb-4">
              Personal Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Name{" "}
                  <span className="text-destructive" aria-label="required">
                    *
                  </span>
                </Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  placeholder="Enter full name"
                  aria-describedby={
                    errors.fullName ? "fullName-error" : undefined
                  }
                  aria-invalid={errors.fullName ? "true" : "false"}
                  className="transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                {errors.fullName && (
                  <p
                    id="fullName-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone{" "}
                  <span className="text-destructive" aria-label="required">
                    *
                  </span>
                </Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="10-15 digits"
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  aria-invalid={errors.phone ? "true" : "false"}
                  className="transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                {errors.phone && (
                  <p
                    id="phone-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="email@example.com"
                  aria-describedby={errors.email ? "email-error" : undefined}
                  aria-invalid={errors.email ? "true" : "false"}
                  className="transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  City{" "}
                  <span className="text-destructive" aria-label="required">
                    *
                  </span>
                </Label>
                <Select
                  value={watch("city")}
                  onValueChange={(value) => setValue("city", value)}
                >
                  <SelectTrigger
                    aria-describedby={errors.city ? "city-error" : undefined}
                  >
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border shadow-md z-50">
                    <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                    <SelectItem value="Mohali">Mohali</SelectItem>
                    <SelectItem value="Zirakpur">Zirakpur</SelectItem>
                    <SelectItem value="Panchkula">Panchkula</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.city && (
                  <p
                    id="city-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Property Information */}
          <fieldset className="space-y-6">
            <legend className="text-lg font-medium mb-4">
              Property Details
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="propertyType" className="text-sm font-medium">
                  Property Type{" "}
                  <span className="text-destructive" aria-label="required">
                    *
                  </span>
                </Label>
                <Select
                  value={watch("propertyType")}
                  onValueChange={(value) =>
                    setValue("propertyType", value as any)
                  }
                >
                  <SelectTrigger
                    aria-describedby={
                      errors.propertyType ? "propertyType-error" : undefined
                    }
                  >
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border shadow-md z-50">
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="plot">Plot</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="shop">Shop</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                  </SelectContent>
                </Select>
                {errors.propertyType && (
                  <p
                    id="propertyType-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.propertyType.message}
                  </p>
                )}
              </div>

              {(propertyType === "apartment" || propertyType === "villa") && (
                <div className="space-y-2">
                  <Label htmlFor="bhk" className="text-sm font-medium">
                    BHK{" "}
                    <span className="text-destructive" aria-label="required">
                      *
                    </span>
                  </Label>
                  <Select
                    value={watch("bhk")}
                    onValueChange={(value) => setValue("bhk", value)}
                  >
                    <SelectTrigger
                      aria-describedby={errors.bhk ? "bhk-error" : undefined}
                    >
                      <SelectValue placeholder="Select BHK" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border shadow-md z-50">
                      <SelectItem value="1">1 BHK</SelectItem>
                      <SelectItem value="2">2 BHK</SelectItem>
                      <SelectItem value="3">3 BHK</SelectItem>
                      <SelectItem value="4">4 BHK</SelectItem>
                      <SelectItem value="5">5 BHK</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.bhk && (
                    <p
                      id="bhk-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {errors.bhk.message}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="purpose" className="text-sm font-medium">
                  Purpose{" "}
                  <span className="text-destructive" aria-label="required">
                    *
                  </span>
                </Label>
                <Select
                  value={watch("purpose")}
                  onValueChange={(value) =>
                    setValue("purpose", value as "investment" | "end-use")
                  }
                >
                  <SelectTrigger
                    aria-describedby={
                      errors.purpose ? "purpose-error" : undefined
                    }
                  >
                    <SelectValue placeholder="Investment or End Use" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border shadow-md z-50">
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="end-use">End Use</SelectItem>
                  </SelectContent>
                </Select>
                {errors.purpose && (
                  <p
                    id="purpose-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.purpose.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Budget */}
          <fieldset className="space-y-6">
            <legend className="text-lg font-medium mb-4">Budget Range</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="budgetMin" className="text-sm font-medium">
                  Minimum Budget (₹)
                </Label>
                <Input
                  id="budgetMin"
                  type="number"
                  {...register("budgetMin", { valueAsNumber: true })}
                  placeholder="e.g., 5000000"
                  aria-describedby={
                    errors.budgetMin ? "budgetMin-error" : undefined
                  }
                  aria-invalid={errors.budgetMin ? "true" : "false"}
                  className="transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                {errors.budgetMin && (
                  <p
                    id="budgetMin-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.budgetMin.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetMax" className="text-sm font-medium">
                  Maximum Budget (₹)
                </Label>
                <Input
                  id="budgetMax"
                  type="number"
                  {...register("budgetMax", { valueAsNumber: true })}
                  placeholder="e.g., 8000000"
                  aria-describedby={
                    errors.budgetMax ? "budgetMax-error" : undefined
                  }
                  aria-invalid={errors.budgetMax ? "true" : "false"}
                  className="transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                {errors.budgetMax && (
                  <p
                    id="budgetMax-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.budgetMax.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Timeline and Source */}
          <fieldset className="space-y-6">
            <legend className="text-lg font-medium mb-4">
              Timeline & Source
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="timeline" className="text-sm font-medium">
                  Timeline{" "}
                  <span className="text-destructive" aria-label="required">
                    *
                  </span>
                </Label>
                <Select
                  value={watch("timeline")}
                  onValueChange={(value) =>
                    setValue(
                      "timeline",
                      value as
                        | "immediate"
                        | "1-3 months"
                        | "3-6 months"
                        | "6+ months"
                    )
                  }
                >
                  <SelectTrigger
                    aria-describedby={
                      errors.timeline ? "timeline-error" : undefined
                    }
                  >
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border shadow-md z-50">
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="1-3 months">1-3 months</SelectItem>
                    <SelectItem value="3-6 months">3-6 months</SelectItem>
                    <SelectItem value="6+ months">6+ months</SelectItem>
                  </SelectContent>
                </Select>
                {errors.timeline && (
                  <p
                    id="timeline-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.timeline.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="source" className="text-sm font-medium">
                  Source{" "}
                  <span className="text-destructive" aria-label="required">
                    *
                  </span>
                </Label>
                <Select
                  value={watch("source")}
                  onValueChange={(value) =>
                    setValue(
                      "source",
                      value as
                        | "website"
                        | "referral"
                        | "social media"
                        | "advertisement"
                        | "walk-in"
                        | "phone"
                        | "other"
                    )
                  }
                >
                  <SelectTrigger
                    aria-describedby={
                      errors.source ? "source-error" : undefined
                    }
                  >
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border shadow-md z-50">
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="social media">Social Media</SelectItem>
                    <SelectItem value="advertisement">Advertisement</SelectItem>
                    <SelectItem value="walk-in">Walk-in</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.source && (
                  <p
                    id="source-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.source.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Status (for edit mode) */}
          {defaultValues && (
            <fieldset className="space-y-6">
              <legend className="text-lg font-medium mb-4">Lead Status</legend>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={watch("status")}
                  onValueChange={(value) =>
                    setValue(
                      "status",
                      value as
                        | "new"
                        | "contacted"
                        | "qualified"
                        | "viewing"
                        | "negotiating"
                        | "closed"
                        | "lost"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border shadow-md z-50">
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="viewing">Viewing</SelectItem>
                    <SelectItem value="negotiating">Negotiating</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </fieldset>
          )}

          {/* Notes */}
          <fieldset className="space-y-6">
            <legend className="text-lg font-medium mb-4">
              Additional Information
            </legend>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes
              </Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Additional notes about the lead..."
                rows={3}
                aria-describedby={errors.notes ? "notes-error" : undefined}
                aria-invalid={errors.notes ? "true" : "false"}
                className="transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              {errors.notes && (
                <p
                  id="notes-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {errors.notes.message}
                </p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tagInput" className="text-sm font-medium">
                Tags
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove ${tag} tag`}
                      className="hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="tagInput"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add tag and press Enter"
                  className="transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  disabled={!tagInput.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          </fieldset>

          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? "Saving..." : submitText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
