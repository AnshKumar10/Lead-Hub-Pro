"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  TrendingUp,
  Clock,
  Target,
  Plus,
  FileSpreadsheet,
} from "lucide-react";
import { useBuyers } from "./hooks/useBuyer";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Link from "next/link";

// Define a type for the status parameter
type BuyerStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "viewing"
  | "negotiating"
  | "closed"
  | "lost";

const getStatusColor = (status: string) => {
  const colors: Record<BuyerStatus, string> = {
    new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    contacted:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    qualified:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    viewing:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    negotiating:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    closed:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
    lost: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return colors[status as BuyerStatus] || colors.new;
};

const Index = () => {
  const { buyers, loading } = useBuyers();

  const stats = {
    totalLeads: buyers.length,
    newLeads: buyers.filter((buyer) => buyer.status === "new").length,
    convertedLeads: buyers.filter((buyer) => buyer.status === "closed").length,
    urgentLeads: buyers.filter((buyer) => buyer.timeline === "immediate")
      .length,
  };

  const conversionRate =
    stats.totalLeads > 0
      ? ((stats.convertedLeads / stats.totalLeads) * 100).toFixed(1)
      : "0";

  // Recent leads (last 3)
  const recentLeads = buyers
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Buyer Lead Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage and track your real estate buyer leads
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/buyers/import">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Import CSV
              </Link>
            </Button>
            <Button asChild>
              <Link href="/buyers/new">
                <Plus className="w-4 h-4 mr-2" />
                New Lead
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLeads}</div>
              <p className="text-xs text-muted-foreground">
                Active buyer leads in system
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Leads</CardTitle>
              <Target className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newLeads}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.urgentLeads}</div>
              <p className="text-xs text-muted-foreground">
                Immediate timeline
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.convertedLeads} converted
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Leads</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/buyers">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading recent leads...
              </div>
            ) : recentLeads.length > 0 ? (
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-medium">{lead.full_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {lead.property_type} • {lead.city}
                            {lead.bhk && ` • ${lead.bhk} BHK`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/buyers/${lead.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No leads yet. Create your first lead to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2"
                asChild
              >
                <Link href="/buyers/new">
                  <Plus className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Add New Lead</div>
                    <div className="text-sm text-muted-foreground">
                      Create a new buyer lead
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2"
                asChild
              >
                <Link href="/buyers">
                  <Users className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">View All Leads</div>
                    <div className="text-sm text-muted-foreground">
                      Browse and filter leads
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2"
                asChild
              >
                <Link href="/buyers/import">
                  <FileSpreadsheet className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Import CSV</div>
                    <div className="text-sm text-muted-foreground">
                      Bulk import leads
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;
