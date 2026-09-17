import { Request, Response } from "express";

import {
  calculateCleaningPrice,
  calculateMovingPrice,
  calculateElectricalPrice,
  getPricingRules,
  getPricingRuleById,
  createPricingRule,
  updatePricingRule,
  updatePricingRuleStatus,
  getServices,
  getServiceById,
  updateService,
  updateServiceStatus,
} from "./pricing.service";
/**
 * Calculate cleaning service price
 */
export async function calculateCleaning(
  req: Request,
  res: Response
) {
  const result = await calculateCleaningPrice(req.body);

  return res.status(200).json({
    success: true,
    message: "Cleaning price calculated successfully",
    pricing: result,
  });
}

/**
 * Calculate moving service price
 */
export async function calculateMoving(
  req: Request,
  res: Response
) {
  const result = await calculateMovingPrice(req.body);

  return res.status(200).json({
    success: true,
    message: "Moving price calculated successfully",
    pricing: result,
  });
}

/**
 * Calculate electrical service price
 */
export async function calculateElectrical(
  req: Request,
  res: Response
) {
  const result = await calculateElectricalPrice(req.body);

  return res.status(200).json({
    success: true,
    message: "Electrical price calculated successfully",
    pricing: result,
  });
}

/**
 * Get all pricing rules
 */
export async function getRules(
  _req: Request,
  res: Response
) {
  const rules = await getPricingRules();

  return res.status(200).json({
    success: true,
    rules,
  });
}

/**
 * Get a single pricing rule
 */
export async function getRule(
  req: Request,
  res: Response
) {
  const rule = await getPricingRuleById(
    String(req.params.id)
  );

  return res.status(200).json({
    success: true,
    rule,
  });
}

/**
 * Create a pricing rule
 */
export async function createRule(
  req: Request,
  res: Response
) {
  const rule = await createPricingRule(req.body);

  return res.status(201).json({
    success: true,
    message: "Pricing rule created successfully",
    rule,
  });
}

/**
 * Update a pricing rule
 */
export async function updateRule(
  req: Request,
  res: Response
) {
  const rule = await updatePricingRule(
    String(req.params.id),
    req.body
  );

  return res.status(200).json({
    success: true,
    message: "Pricing rule updated successfully",
    rule,
  });
}

/**
 * Activate or deactivate a pricing rule
 */
export async function updateRuleStatus(
  req: Request,
  res: Response
) {
  const rule = await updatePricingRuleStatus(
    String(req.params.id),
    req.body.isActive
  );

  return res.status(200).json({
    success: true,
    message: `Pricing rule ${
      rule.isActive ? "activated" : "deactivated"
    } successfully`,
    rule,
  });
}

/**
 * Get all services in the service catalog
 */
export async function getServiceCatalog(
  _req: Request,
  res: Response
) {
  const services = await getServices();

  return res.status(200).json({
    success: true,
    services,
  });
}

/**
 * Get a single service
 */
export async function getServiceCatalogItem(
  req: Request,
  res: Response
) {
  const service = await getServiceById(
    String(req.params.id)
  );

  return res.status(200).json({
    success: true,
    service,
  });
}

/**
 * Update a service
 */
export async function updateServiceCatalogItem(
  req: Request,
  res: Response
) {
  const service = await updateService(
    String(req.params.id),
    req.body
  );

  return res.status(200).json({
    success: true,
    message: "Service updated successfully",
    service,
  });
}

/**
 * Activate or deactivate a service
 */
export async function updateServiceCatalogStatus(
  req: Request,
  res: Response
) {
  const service = await updateServiceStatus(
    String(req.params.id),
    req.body.isActive
  );

  return res.status(200).json({
    success: true,
    message: `Service ${
      service.isActive
        ? "activated"
        : "deactivated"
    } successfully`,
    service,
  });
}