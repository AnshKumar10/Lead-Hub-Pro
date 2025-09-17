import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X, Download } from "lucide-react";
import { BuyerFilter } from "@/lib/validations/buyer";

interface BuyerFiltersProps {
  filters: Partial<BuyerFilter>;
  onFiltersChange: (filters: Partial<BuyerFilter>) => void;
  onExport: () => void;
  totalCount: number;
}

export default function BuyerFilters({
  filters,
  onFiltersChange,
  onExport,
  totalCount,
}: BuyerFiltersProps) {
  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search: search || undefined });
  };

  const handleFilterChange = (
    key: keyof BuyerFilter,
    value: string | undefined
  ) => {
    const actualValue = value === "all" ? undefined : value;
    onFiltersChange({ ...filters, [key]: actualValue });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: undefined,
      city: undefined,
      propertyType: undefined,
      status: undefined,
      timeline: undefined,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.city ||
    filters.propertyType ||
    filters.status ||
    filters.timeline;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, phone, or email..."
              value={filters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Select
              value={filters.city || "all"}
              onValueChange={(value) => handleFilterChange("city", value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent className="bg-popover border shadow-md z-50">
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                <SelectItem value="Mohali">Mohali</SelectItem>
                <SelectItem value="Zirakpur">Zirakpur</SelectItem>
                <SelectItem value="Panchkula">Panchkula</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.propertyType || "all"}
              onValueChange={(value) =>
                handleFilterChange("propertyType", value)
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent className="bg-popover border shadow-md z-50">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="shop">Shop</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status || "all"}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border shadow-md z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="viewing">Viewing</SelectItem>
                <SelectItem value="negotiating">Negotiating</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.timeline || "all"}
              onValueChange={(value) => handleFilterChange("timeline", value)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Timeline" />
              </SelectTrigger>
              <SelectContent className="bg-popover border shadow-md z-50">
                <SelectItem value="all">All Timeline</SelectItem>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="1-3 months">1-3 months</SelectItem>
                <SelectItem value="3-6 months">3-6 months</SelectItem>
                <SelectItem value="6+ months">6+ months</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Results summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {totalCount} lead{totalCount !== 1 ? "s" : ""}
            {hasActiveFilters && " (filtered)"}
          </div>
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filters active</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
