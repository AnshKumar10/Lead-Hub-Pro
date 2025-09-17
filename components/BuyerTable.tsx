import type { Database } from "@/app/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Edit, Phone, Mail } from "lucide-react";
import Link from "next/link";

type Buyer = Database["public"]["Tables"]["buyers"]["Row"];

const getStatusColor = (status: string) => {
  const colors = {
    new: "bg-primary/10 text-primary border-primary/20",
    contacted: "bg-warning/10 text-warning border-warning/20",
    qualified: "bg-success/10 text-success border-success/20",
    viewing: "bg-accent/10 text-accent-foreground border-accent/20",
    negotiating: "bg-warning/10 text-warning border-warning/20",
    closed: "bg-success/10 text-success border-success/20",
    lost: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return colors[status as keyof typeof colors] || colors.new;
};

const formatBudget = (min?: number | null, max?: number | null) => {
  if (!min && !max) return "Budget not specified";

  const formatAmount = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  if (min && max) return `${formatAmount(min)} - ${formatAmount(max)}`;
  if (min) return `₹${formatAmount(min)}+`;
  if (max) return `Up to ${formatAmount(max)}`;
  return "Budget not specified";
};

interface BuyerTableProps {
  buyers: Buyer[];
  onEdit?: (buyer: Buyer) => void;
}

export default function BuyerTable({ buyers, onEdit }: BuyerTableProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  if (buyers.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div className="space-y-2 mb-6">
            <h3 className="text-xl font-semibold">No leads found</h3>
            <p className="text-muted-foreground max-w-sm">
              Get started by creating your first buyer lead or adjust your
              filters
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/buyers/new">Create New Lead</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold">Name & Contact</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">
                  Property Details
                </TableHead>
                <TableHead className="font-semibold">Budget</TableHead>
                <TableHead className="font-semibold">Timeline</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Updated</TableHead>
                <TableHead className="w-[120px] font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buyers.map((buyer) => (
                <TableRow
                  key={buyer.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="py-4">
                    <div className="space-y-2">
                      <div className="font-medium text-foreground">
                        {buyer.full_name}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone
                            className="w-3 h-3 flex-shrink-0"
                            aria-hidden="true"
                          />
                          <span>{buyer.phone}</span>
                        </div>
                        {buyer.email && (
                          <div className="flex items-center gap-1">
                            <Mail
                              className="w-3 h-3 flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span
                              className="truncate max-w-[180px]"
                              title={buyer.email}
                            >
                              {buyer.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">{buyer.city}</Badge>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{buyer.property_type}</div>
                      <div className="text-sm text-muted-foreground">
                        {buyer.bhk && `${buyer.bhk} BHK • `}
                        {buyer.purpose}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">
                      {formatBudget(buyer.budget_min, buyer.budget_max)}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {buyer.timeline}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`text-xs ${getStatusColor(buyer.status)}`}
                    >
                      {buyer.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(new Date(buyer.updated_at))}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 w-8 p-0"
                      >
                        <Link
                          href={`/buyers/${buyer.id}`}
                          aria-label={`View ${buyer.full_name}'s details`}
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => onEdit(buyer)}
                          aria-label={`Edit ${buyer.full_name}'s information`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
