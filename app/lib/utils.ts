import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number | string | null | undefined
): string {
  if (!amount) return "₹0";
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
}

export function formatBudget(min?: number | null, max?: number | null): string {
  if (!min && !max) return "Budget not specified";
  if (!min) return `Up to ${formatCurrency(max)}`;
  if (!max) return `From ${formatCurrency(min)}`;
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "new":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "contacted":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "qualified":
      return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    case "viewing":
      return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
    case "negotiating":
      return "bg-orange-500/10 text-orange-600 border-orange-500/20";
    case "closed":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "lost":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
  }
}
