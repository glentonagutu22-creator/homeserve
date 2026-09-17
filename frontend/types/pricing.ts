export interface PricingBreakdownItem {
  item: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface PricingResult {
  serviceId: string;
  serviceName: string;
  pricingType: "FIXED" | "CALCULATED" | "QUOTE";
  basePrice: number;
  breakdown: PricingBreakdownItem[];
  totalAmount: number;
}

export interface PricingResponse {
  success: boolean;
  message: string;
  pricing: PricingResult;
}

// =====================================================
// PRICING RULES
// =====================================================

export type PricingCategory =
  | "CLEANING"
  | "MOVING"
  | "ELECTRICAL";

export interface PricingRule {
  id: string;
  category: PricingCategory;
  name: string;
  description: string | null;
  unit: string;
  unitPrice: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PricingRulesResponse {
  success: boolean;
  rules: PricingRule[];
}

export interface PricingRuleResponse {
  success: boolean;
  rule: PricingRule;
}

export interface CreatePricingRuleData {
  category: PricingCategory;
  name: string;
  description?: string;
  unit: string;
  unitPrice: number;
  isActive?: boolean;
}

export interface UpdatePricingRuleData {
  name?: string;
  description?: string;
  unit?: string;
  unitPrice?: number;
}

export interface UpdatePricingRuleStatusData {
  isActive: boolean;
}