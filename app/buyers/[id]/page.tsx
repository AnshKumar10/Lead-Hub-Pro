"use client";

import { useState, useEffect } from "react";
import { BuyerForm as BuyerFormType } from "@/app/lib/validations/buyer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { useParams } from "next/navigation";
import { useBuyers } from "@/app/hooks/useBuyer";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Link from "next/link";
import { toast } from "sonner";
import BuyerForm from "@/components/ui/BuyerForm";
import { formatBudget, getStatusColor } from "@/app/lib/utils";

export default function BuyerDetail() {
  const { id } = useParams();

  const [isEditing, setIsEditing] = useState(false);

  const { getBuyer } = useBuyers();
  const [buyer, setBuyer] = useState(null);

  useEffect(() => {
    if (id) getBuyer(id).then(setBuyer);
  }, []);

  if (!buyer) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Lead Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The requested buyer lead could not be found.
          </p>
          <Button asChild>
            <Link href="/buyers">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Leads
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = (data: BuyerFormType) => {
    console.log("Updating buyer lead:", data);

    toast.success(`Lead for ${data.fullName} has been updated successfully.`);

    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/buyers">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Leads
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{buyer.full_name}</h1>
              <p className="text-muted-foreground mt-2">
                Lead details and information
              </p>
            </div>
          </div>
        </div>

        {isEditing ? (
          <div className="max-w-4xl">
            <BuyerForm
              defaultValues={buyer}
              onSubmit={handleSubmit}
              submitText="Update Lead"
            />
            <div className="mt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{buyer.phone}</p>
                      </div>
                    </div>

                    {buyer.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{buyer.email}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">City</p>
                        <p className="font-medium">{buyer.city}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Property Type
                      </p>
                      <p className="font-medium">{buyer.property_type}</p>
                    </div>

                    {buyer.bhk && (
                      <div>
                        <p className="text-sm text-muted-foreground">BHK</p>
                        <p className="font-medium">{buyer.bhk} BHK</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-muted-foreground">Purpose</p>
                      <p className="font-medium">{buyer.purpose}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="font-medium">
                        {formatBudget(buyer.budget_min, buyer.budget_max)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Timeline</p>
                      <p className="font-medium">{buyer.timeline}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Source</p>
                      <p className="font-medium">{buyer.source}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {buyer.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{buyer.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Lead Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge
                    className={`${getStatusColor(
                      buyer.status
                    )} text-base px-3 py-1`}
                  >
                    {buyer.status}
                  </Badge>
                </CardContent>
              </Card>

              {/* Tags */}
              {buyer.tags && buyer.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {buyer.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Last Updated */}
              <Card>
                <CardHeader>
                  <CardTitle>Last Updated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {buyer.updated_at &&
                        formatDate(new Date(buyer.updated_at))}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`tel:${buyer.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </a>
                  </Button>
                  {buyer.email && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`mailto:${buyer.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
