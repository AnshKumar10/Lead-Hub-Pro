"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./UserMenu";
import { Plus, Users, Upload, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-xl font-bold text-primary hover:text-primary-hover transition-colors"
                aria-label="LeadCRM Home"
              >
                LeadCRM
              </Link>
              <nav
                className="hidden md:flex items-center gap-2"
                role="navigation"
                aria-label="Main navigation"
              >
                <Link
                  href="/"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive("/")
                      ? "text-primary bg-primary-light shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                  aria-current={isActive("/") ? "page" : undefined}
                >
                  <Home className="w-4 h-4" aria-hidden="true" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/buyers"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive("/buyers")
                      ? "text-primary bg-primary-light shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                  aria-current={isActive("/buyers") ? "page" : undefined}
                >
                  <Users className="w-4 h-4" aria-hidden="true" />
                  <span>Buyer Leads</span>
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hidden sm:flex"
              >
                <Link href="/buyers/import">
                  <Upload className="w-4 h-4 mr-2" aria-hidden="true" />
                  Import CSV
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/buyers/new">
                  <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                  New Lead
                </Link>
              </Button>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        {children}
      </main>
    </div>
  );
}
