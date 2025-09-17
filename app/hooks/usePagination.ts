"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface UsePaginationOptions {
  totalItems: number;
  pageSize?: number;
}

export function usePagination({
  totalItems,
  pageSize = 10,
}: UsePaginationOptions) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // current page from URL
  const currentPage = useMemo(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    return Math.max(1, page);
  }, [searchParams]);

  const totalPages = Math.ceil(totalItems / pageSize);

  const setPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));

    // Build new URLSearchParams from current searchParams
    const params = new URLSearchParams(searchParams.toString());

    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }

    // Push new URL with updated params
    router.push(`${pathname}?${params.toString()}`);
  };

  const goToNextPage = () => setPage(currentPage + 1);
  const goToPreviousPage = () => setPage(currentPage - 1);
  const goToFirstPage = () => setPage(1);
  const goToLastPage = () => setPage(totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return {
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    startIndex,
    endIndex,
    setPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}
