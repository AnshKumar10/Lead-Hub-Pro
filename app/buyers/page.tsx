"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useBuyers } from "@/hooks/useBuyer";
import { BuyerFilter } from "@/lib/validations/buyer";
import Link from "next/link";
import { usePagination } from "@/hooks/usePagination";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import BuyerTable from "@/components/BuyerTable";
import BuyerFilters from "@/components/BuyerFilter";

export default function BuyerList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { buyers } = useBuyers();

  // URL-synced filters
  const [filters, setFilters] = useState<Partial<BuyerFilter>>(() => ({
    search: searchParams.get("search") || undefined,
    city: (searchParams.get("city") as any) || undefined,
    propertyType: (searchParams.get("propertyType") as any) || undefined,
    status: (searchParams.get("status") as any) || undefined,
    timeline: (searchParams.get("timeline") as any) || undefined,
  }));

  // Debounced search
  const debouncedSearch = useDebounce(filters.search || "", 500);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, String(value));
      }
    });

    // Preserve page if not searching
    const currentPage = searchParams.get("page");
    if (currentPage && !filters.search) {
      params.set("page", currentPage);
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [filters, pathname, router, searchParams]);

  // Filter and search logic
  const filteredBuyers = useMemo(() => {
    let result = [...buyers];

    if (debouncedSearch) {
      const searchTerm = debouncedSearch.toLowerCase();
      result = result.filter(
        (buyer) =>
          buyer.full_name.toLowerCase().includes(searchTerm) ||
          buyer.phone.includes(searchTerm) ||
          (buyer.email && buyer.email.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.city) {
      result = result.filter((buyer) => buyer.city === filters.city);
    }

    if (filters.propertyType) {
      result = result.filter(
        (buyer) => buyer.property_type === filters.propertyType
      );
    }

    if (filters.status) {
      result = result.filter((buyer) => buyer.status === filters.status);
    }

    if (filters.timeline) {
      result = result.filter((buyer) => buyer.timeline === filters.timeline);
    }

    result.sort((a, b) => {
      if (!a.updated_at || !b.updated_at) return 0;
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });

    return result;
  }, [
    buyers,
    debouncedSearch,
    filters.city,
    filters.propertyType,
    filters.status,
    filters.timeline,
  ]);

  // Pagination hook
  const pagination = usePagination({
    totalItems: filteredBuyers.length,
    pageSize: 10,
  });

  const paginatedBuyers = useMemo(() => {
    return filteredBuyers.slice(pagination.startIndex, pagination.endIndex);
  }, [filteredBuyers, pagination.startIndex, pagination.endIndex]);

  const handleFiltersChange = (newFilters: Partial<BuyerFilter>) => {
    setFilters(newFilters);
    if (pagination.currentPage > 1) {
      pagination.setPage(1);
    }
  };

  const handleEdit = (buyer: any) => {
    router.push(`/buyers/${buyer.id}/edit`);
  };

  const handleExport = () => {
    // Create CSV content
    const headers = [
      "fullName",
      "email",
      "phone",
      "city",
      "propertyType",
      "bhk",
      "purpose",
      "budgetMin",
      "budgetMax",
      "timeline",
      "source",
      "notes",
      "tags",
      "status",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredBuyers.map((buyer) =>
        [
          buyer.full_name,
          buyer.email || "",
          buyer.phone,
          buyer.city,
          buyer.property_type,
          buyer.bhk || "",
          buyer.purpose,
          buyer.budget_min || "",
          buyer.budget_max || "",
          buyer.timeline,
          buyer.source,
          buyer.notes || "",
          buyer.tags?.join(";") || "",
          buyer.status,
        ]
          .map((field) => `"${field}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `buyer-leads-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <header className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Buyer Leads</h1>
              <p className="text-muted-foreground">
                Manage and track all your buyer leads • {filteredBuyers.length}{" "}
                total
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button variant="outline" size="sm" asChild className="sm:hidden">
                <Link href="/buyers/import">
                  <Upload className="w-4 h-4 mr-2" aria-hidden="true" />
                  Import CSV
                </Link>
              </Button>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/buyers/new">
                  <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                  New Lead
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Filters Section */}
        <section aria-label="Filter and search options">
          <BuyerFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
            totalCount={filteredBuyers.length}
          />
        </section>

        {/* Table Section */}
        <section aria-label="Buyer leads table" className="space-y-6">
          <BuyerTable buyers={paginatedBuyers} onEdit={handleEdit} />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <nav aria-label="Pagination" className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={pagination.goToPreviousPage}
                      className={
                        !pagination.hasPreviousPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                      aria-disabled={!pagination.hasPreviousPage}
                    />
                  </PaginationItem>

                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => pagination.setPage(pageNumber)}
                            isActive={pagination.currentPage === pageNumber}
                            className="cursor-pointer"
                            aria-current={
                              pagination.currentPage === pageNumber
                                ? "page"
                                : undefined
                            }
                            aria-label={`Go to page ${pageNumber}`}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={pagination.goToNextPage}
                      className={
                        !pagination.hasNextPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                      aria-disabled={!pagination.hasNextPage}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </nav>
          )}

          <div
            className="text-sm text-muted-foreground text-center py-2"
            role="status"
            aria-live="polite"
          >
            Showing {pagination.startIndex + 1}-{pagination.endIndex} of{" "}
            {pagination.totalItems} leads
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
