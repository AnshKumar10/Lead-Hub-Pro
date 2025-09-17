import { z } from "zod";

// Enums for buyer data
export const CityEnum = z.enum([
  "Chandigarh",
  "Mohali",
  "Zirakpur",
  "Panchkula",
  "Other",
]);

export const PropertyTypeEnum = z.enum([
  "apartment",
  "villa",
  "plot",
  "office",
  "shop",
  "warehouse",
]);

export const BHKEnum = z.enum(["1", "2", "3", "4", "5"]);

export const PurposeEnum = z.enum(["investment", "end-use"]);

export const TimelineEnum = z.enum([
  "immediate",
  "1-3 months",
  "3-6 months",
  "6+ months",
]);

export const SourceEnum = z.enum([
  "website",
  "referral",
  "social media",
  "advertisement",
  "walk-in",
  "phone",
  "other",
]);

export const StatusEnum = z.enum([
  "new",
  "contacted",
  "qualified",
  "viewing",
  "negotiating",
  "closed",
  "lost",
]);

// Base buyer object schema
const BaseBuyerSchema = z.object({
  id: z.string().uuid().optional(),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name must be less than 80 characters"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().regex(/^\d{10,15}$/, "Phone must be 10-15 digits"),
  city: CityEnum,
  propertyType: PropertyTypeEnum,
  bhk: BHKEnum.optional(),
  purpose: PurposeEnum,
  budgetMin: z.number().int().positive().optional(),
  budgetMax: z.number().int().positive().optional(),
  timeline: TimelineEnum,
  source: SourceEnum,
  status: StatusEnum.default("new"),
  notes: z
    .string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),
  tags: z.array(z.string()).default([]),
  ownerId: z.string().optional(),
  updatedAt: z.date().optional(),
});

// Main buyer schema with refinements
export const BuyerSchema = BaseBuyerSchema.refine(
  (data) => {
    // BHK required for Apartment and Villa
    if (
      (data.propertyType === "apartment" || data.propertyType === "villa") &&
      !data.bhk
    ) {
      return false;
    }
    return true;
  },
  {
    message: "BHK is required for apartment and villa properties",
    path: ["bhk"],
  }
).refine(
  (data) => {
    // Budget max should be >= budget min
    if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
      return false;
    }
    return true;
  },
  {
    message: "Maximum budget must be greater than or equal to minimum budget",
    path: ["budgetMax"],
  }
);

export type Buyer = z.infer<typeof BuyerSchema>;

// Form schema (without server-generated fields)
export const BuyerFormSchema = BaseBuyerSchema.omit({
  id: true,
  ownerId: true,
  updatedAt: true,
})
  .refine(
    (data) => {
      // BHK required for Apartment and Villa
      if (
        (data.propertyType === "apartment" || data.propertyType === "villa") &&
        !data.bhk
      ) {
        return false;
      }
      return true;
    },
    {
      message: "BHK is required for apartment and villa properties",
      path: ["bhk"],
    }
  )
  .refine(
    (data) => {
      // Budget max should be >= budget min
      if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
        return false;
      }
      return true;
    },
    {
      message: "Maximum budget must be greater than or equal to minimum budget",
      path: ["budgetMax"],
    }
  );

export type BuyerForm = z.infer<typeof BuyerFormSchema>;

// CSV import schema
export const CSVBuyerSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().regex(/^\d{10,15}$/),
  city: z.string().refine((val) => CityEnum.safeParse(val).success),
  propertyType: z
    .string()
    .refine((val) => PropertyTypeEnum.safeParse(val).success),
  bhk: z.string().optional(),
  purpose: z.string().refine((val) => PurposeEnum.safeParse(val).success),
  budgetMin: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .optional(),
  budgetMax: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .optional(),
  timeline: z.string().refine((val) => TimelineEnum.safeParse(val).success),
  source: z.string().refine((val) => SourceEnum.safeParse(val).success),
  notes: z.string().max(1000).optional(),
  tags: z
    .string()
    .transform((val) => (val ? val.split(",").map((t) => t.trim()) : []))
    .optional(),
  status: z
    .string()
    .refine((val) => StatusEnum.safeParse(val).success)
    .default("new"),
});

export type CSVBuyer = z.infer<typeof CSVBuyerSchema>;

// Filter schema for search/filtering
export const BuyerFilterSchema = z.object({
  search: z.string().optional(),
  city: CityEnum.optional(),
  propertyType: PropertyTypeEnum.optional(),
  status: StatusEnum.optional(),
  timeline: TimelineEnum.optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(10),
});

export type BuyerFilter = z.infer<typeof BuyerFilterSchema>;
