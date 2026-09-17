import { apiRequest } from "./api";

import type {
  PricingResponse,
  PricingResult,
  PricingRule,
  PricingRulesResponse,
  PricingRuleResponse,
  CreatePricingRuleData,
  UpdatePricingRuleData,
} from "../types/pricing";

export interface CleaningPricingData {
  serviceId: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  cleaningType: string;
  additionalRequirements?: string;
}

export interface MovingPricingData {
  serviceId: string;
  pickupAddress: string;
  destinationAddress: string;
  propertyType: string;
  truckSize?: string;
  numberOfMovers?: number;
  packingRequired: boolean;
  estimatedDistanceKm?: number;
  specialItems?: string;
}

export interface ElectricalPricingData {
  serviceId: string;
  propertyType: string;
  numberOfFloors?: number;
  bedrooms?: number;
  newInstallation: boolean;
  rewiring: boolean;
  numberOfSockets?: number;
  numberOfLights?: number;
  distributionBoard: boolean;
  additionalRequirements?: string;
}

// =====================================================
// PRICE CALCULATIONS
// =====================================================

export async function calculateCleaningPrice(
  data: CleaningPricingData
): Promise<PricingResult> {
  const response = await apiRequest<PricingResponse>(
    "/pricing/cleaning",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  return response.pricing;
}

export async function calculateMovingPrice(
  data: MovingPricingData
): Promise<PricingResult> {
  const response = await apiRequest<PricingResponse>(
    "/pricing/moving",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  return response.pricing;
}

export async function calculateElectricalPrice(
  data: ElectricalPricingData
): Promise<PricingResult> {
  const response = await apiRequest<PricingResponse>(
    "/pricing/electrical",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  return response.pricing;
}

// =====================================================
// ADMIN PRICING RULES
// =====================================================

/**
 * Get all pricing rules.
 */
export async function getPricingRules(): Promise<
  PricingRule[]
> {
  const response =
    await apiRequest<PricingRulesResponse>(
      "/pricing/rules"
    );

  return response.rules;
}

/**
 * Get a single pricing rule.
 */
export async function getPricingRule(
  id: string
): Promise<PricingRule> {
  const response =
    await apiRequest<PricingRuleResponse>(
      `/pricing/rules/${id}`
    );

  return response.rule;
}

/**
 * Create a pricing rule.
 */
export async function createPricingRule(
  data: CreatePricingRuleData
): Promise<PricingRule> {
  const response =
    await apiRequest<PricingRuleResponse>(
      "/pricing/rules",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

  return response.rule;
}

/**
 * Update a pricing rule.
 */
export async function updatePricingRule(
  id: string,
  data: UpdatePricingRuleData
): Promise<PricingRule> {
  const response =
    await apiRequest<PricingRuleResponse>(
      `/pricing/rules/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );

  return response.rule;
}

/**
 * Activate or deactivate a pricing rule.
 */
export async function updatePricingRuleStatus(
  id: string,
  isActive: boolean
): Promise<PricingRule> {
  const response =
    await apiRequest<PricingRuleResponse>(
      `/pricing/rules/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          isActive,
        }),
      }
    );

  return response.rule;
}


export interface Service {
  id: string;
  name: string;
  description: string | null;
  category:
    | "CLEANING"
    | "MOVING"
    | "ELECTRICAL";
  pricingType:
    | "FIXED"
    | "CALCULATED"
    | "QUOTE";
  basePrice: string | number | null;
  duration: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServicesResponse {
  success: boolean;
  services: Service[];
}

interface ServiceResponse {
  success: boolean;
  message?: string;
  service: Service;
}

export async function getServices(): Promise<Service[]> {
  const data =
    await apiRequest<ServicesResponse>(
      "/pricing/services"
    );

  return data.services;
}

export async function updateService(
  serviceId: string,
  data: {
    name?: string;
    description?: string | null;
    pricingType?:
      | "FIXED"
      | "CALCULATED"
      | "QUOTE";
    basePrice?: number | null;
    duration?: number | null;
  }
): Promise<Service> {
  const response =
    await apiRequest<ServiceResponse>(
      `/pricing/services/${serviceId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );

  return response.service;
}

export async function updateServiceStatus(
  serviceId: string,
  isActive: boolean
): Promise<Service> {
  const response =
    await apiRequest<ServiceResponse>(
      `/pricing/services/${serviceId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          isActive,
        }),
      }
    );

  return response.service;
}