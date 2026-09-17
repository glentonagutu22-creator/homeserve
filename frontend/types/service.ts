export type ServiceCategory =
  | "CLEANING"
  | "MOVING"
  | "ELECTRICAL";

export type PricingType =
  | "FIXED"
  | "CALCULATED"
  | "QUOTE";

export interface Service {
  id: string;
  name: string;
  description: string | null;
  category: ServiceCategory;
  pricingType: PricingType;
  basePrice: string | null;
  duration: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}