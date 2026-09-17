import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

/**
 * Result returned by the pricing engine.
 */
interface PricingResult {
  serviceId: string;
  serviceName: string;
  pricingType: string;
  basePrice: number;
  breakdown: {
    item: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  totalAmount: number;
}

/**
 * Round a monetary value to two decimal places.
 */
function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/**
 * Get and validate a service for pricing.
 */
async function getServiceForPricing(serviceId: string) {
  const service = await prisma.service.findFirst({
    where: {
      id: serviceId,
      isActive: true,
    },
  });

  if (!service) {
    throw new AppError("Service not found or inactive", 404);
  }

  if (service.pricingType !== "CALCULATED") {
    throw new AppError(
      `This service uses ${service.pricingType} pricing and does not require calculated pricing`,
      400
    );
  }

  return service;
}

/**
 * Get an active pricing rule.
 */
async function getPricingRule(
  category: "CLEANING" | "MOVING" | "ELECTRICAL",
  name: string
): Promise<number> {
  const rule = await prisma.pricingRule.findFirst({
    where: {
      category,
      name,
      isActive: true,
    },
  });

  if (!rule) {
    throw new AppError(
      `Pricing rule "${name}" is not configured for ${category.toLowerCase()} services`,
      500
    );
  }

  const unitPrice = Number(rule.unitPrice);

  if (unitPrice < 0) {
    throw new AppError(
      `Pricing rule "${name}" has an invalid price`,
      500
    );
  }

  return unitPrice;
}

/**
 * Calculate cleaning service price.
 *
 * Pricing:
 *
 * Base price
 * + bedroom charge
 * + bathroom charge
 * + area charge
 */
export async function calculateCleaningPrice(data: {
  serviceId: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  cleaningType: string;
  additionalRequirements?: string;
}): Promise<PricingResult> {
  const service = await getServiceForPricing(data.serviceId);

  const basePrice = service.basePrice
    ? Number(service.basePrice)
    : 0;

  if (basePrice <= 0) {
    throw new AppError(
      "This service does not have a valid base price configured",
      400
    );
  }

  const bedroomRate = await getPricingRule(
    "CLEANING",
    "BEDROOM"
  );

  const bathroomRate = await getPricingRule(
    "CLEANING",
    "BATHROOM"
  );

  const areaRate = await getPricingRule(
    "CLEANING",
    "SQUARE_METER"
  );

  const breakdown: PricingResult["breakdown"] = [];

  breakdown.push({
    item: "Base service",
    quantity: 1,
    unitPrice: basePrice,
    amount: basePrice,
  });

  if (data.bedrooms && data.bedrooms > 0) {
    breakdown.push({
      item: "Bedrooms",
      quantity: data.bedrooms,
      unitPrice: bedroomRate,
      amount: data.bedrooms * bedroomRate,
    });
  }

  if (data.bathrooms && data.bathrooms > 0) {
    breakdown.push({
      item: "Bathrooms",
      quantity: data.bathrooms,
      unitPrice: bathroomRate,
      amount: data.bathrooms * bathroomRate,
    });
  }

  if (data.squareMeters && data.squareMeters > 0) {
    breakdown.push({
      item: "Area",
      quantity: data.squareMeters,
      unitPrice: areaRate,
      amount: data.squareMeters * areaRate,
    });
  }

  const totalAmount = roundMoney(
    breakdown.reduce(
      (total, item) => total + item.amount,
      0
    )
  );

  return {
    serviceId: service.id,
    serviceName: service.name,
    pricingType: service.pricingType,
    basePrice: roundMoney(basePrice),
    breakdown,
    totalAmount,
  };
}

/**
 * Calculate moving service price.
 *
 * Pricing:
 *
 * Base price
 * + distance charge
 * + mover charge
 * + packing charge
 */
export async function calculateMovingPrice(data: {
  serviceId: string;
  pickupAddress: string;
  destinationAddress: string;
  propertyType: string;
  truckSize?: string;
  numberOfMovers?: number;
  packingRequired: boolean;
  estimatedDistanceKm?: number;
  specialItems?: string;
}): Promise<PricingResult> {
  const service = await getServiceForPricing(data.serviceId);

  const basePrice = service.basePrice
    ? Number(service.basePrice)
    : 0;

  if (basePrice <= 0) {
    throw new AppError(
      "This service does not have a valid base price configured",
      400
    );
  }

  const distanceRate = await getPricingRule(
    "MOVING",
    "DISTANCE_KM"
  );

  const moverRate = await getPricingRule(
    "MOVING",
    "MOVER"
  );

  const packingRate = await getPricingRule(
    "MOVING",
    "PACKING"
  );

  const breakdown: PricingResult["breakdown"] = [];

  breakdown.push({
    item: "Base service",
    quantity: 1,
    unitPrice: basePrice,
    amount: basePrice,
  });

  if (
    data.estimatedDistanceKm &&
    data.estimatedDistanceKm > 0
  ) {
    breakdown.push({
      item: "Distance",
      quantity: data.estimatedDistanceKm,
      unitPrice: distanceRate,
      amount:
        data.estimatedDistanceKm * distanceRate,
    });
  }

  if (
    data.numberOfMovers &&
    data.numberOfMovers > 0
  ) {
    breakdown.push({
      item: "Movers",
      quantity: data.numberOfMovers,
      unitPrice: moverRate,
      amount:
        data.numberOfMovers * moverRate,
    });
  }

  if (data.packingRequired) {
    breakdown.push({
      item: "Packing service",
      quantity: 1,
      unitPrice: packingRate,
      amount: packingRate,
    });
  }

  const totalAmount = roundMoney(
    breakdown.reduce(
      (total, item) => total + item.amount,
      0
    )
  );

  return {
    serviceId: service.id,
    serviceName: service.name,
    pricingType: service.pricingType,
    basePrice: roundMoney(basePrice),
    breakdown,
    totalAmount,
  };
}

/**
 * Calculate electrical service price.
 *
 * Pricing:
 *
 * Base price
 * + socket installation
 * + light installation
 * + distribution board
 * + rewiring
 */
export async function calculateElectricalPrice(data: {
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
}): Promise<PricingResult> {
  const service = await getServiceForPricing(data.serviceId);

  const basePrice = service.basePrice
    ? Number(service.basePrice)
    : 0;

  if (basePrice <= 0) {
    throw new AppError(
      "This service does not have a valid base price configured",
      400
    );
  }

  const socketRate = await getPricingRule(
    "ELECTRICAL",
    "SOCKET"
  );

  const lightRate = await getPricingRule(
    "ELECTRICAL",
    "LIGHT"
  );

  const distributionBoardRate =
    await getPricingRule(
      "ELECTRICAL",
      "DISTRIBUTION_BOARD"
    );

  const rewiringRate = await getPricingRule(
    "ELECTRICAL",
    "REWIRING"
  );

  const breakdown: PricingResult["breakdown"] = [];

  breakdown.push({
    item: "Base service",
    quantity: 1,
    unitPrice: basePrice,
    amount: basePrice,
  });

  if (
    data.numberOfSockets &&
    data.numberOfSockets > 0
  ) {
    breakdown.push({
      item: "Socket installation",
      quantity: data.numberOfSockets,
      unitPrice: socketRate,
      amount:
        data.numberOfSockets * socketRate,
    });
  }

  if (
    data.numberOfLights &&
    data.numberOfLights > 0
  ) {
    breakdown.push({
      item: "Light installation",
      quantity: data.numberOfLights,
      unitPrice: lightRate,
      amount:
        data.numberOfLights * lightRate,
    });
  }

  if (data.distributionBoard) {
    breakdown.push({
      item: "Distribution board",
      quantity: 1,
      unitPrice: distributionBoardRate,
      amount: distributionBoardRate,
    });
  }

  if (data.rewiring) {
    breakdown.push({
      item: "Rewiring",
      quantity: 1,
      unitPrice: rewiringRate,
      amount: rewiringRate,
    });
  }

  const totalAmount = roundMoney(
    breakdown.reduce(
      (total, item) => total + item.amount,
      0
    )
  );

  return {
    serviceId: service.id,
    serviceName: service.name,
    pricingType: service.pricingType,
    basePrice: roundMoney(basePrice),
    breakdown,
    totalAmount,
  };
}
/**
 * Get all pricing rules.
 */
export async function getPricingRules() {
  return prisma.pricingRule.findMany({
    orderBy: [
      { category: "asc" },
      { name: "asc" },
    ],
  });
}

/**
 * Get a pricing rule by ID.
 */
export async function getPricingRuleById(
  pricingRuleId: string
) {
  const rule = await prisma.pricingRule.findUnique({
    where: {
      id: pricingRuleId,
    },
  });

  if (!rule) {
    throw new AppError(
      "Pricing rule not found",
      404
    );
  }

  return rule;
}

/**
 * Create a pricing rule.
 */
export async function createPricingRule(data: {
  category:
    | "CLEANING"
    | "MOVING"
    | "ELECTRICAL";
  name: string;
  description?: string;
  unit: string;
  unitPrice: number;
  isActive?: boolean;
}) {
  if (data.unitPrice < 0) {
    throw new AppError(
      "Unit price cannot be negative",
      400
    );
  }

  const existingRule =
    await prisma.pricingRule.findUnique({
      where: {
        category_name: {
          category: data.category,
          name: data.name,
        },
      },
    });

  if (existingRule) {
    throw new AppError(
      "A pricing rule with this name already exists for this category",
      409
    );
  }

  return prisma.pricingRule.create({
    data: {
      category: data.category,
      name: data.name,
      description: data.description,
      unit: data.unit,
      unitPrice: data.unitPrice,
      isActive: data.isActive ?? true,
    },
  });
}

/**
 * Update a pricing rule.
 */
export async function updatePricingRule(
  pricingRuleId: string,
  data: {
    name?: string;
    description?: string;
    unit?: string;
    unitPrice?: number;
  }
) {
  const existingRule =
    await prisma.pricingRule.findUnique({
      where: {
        id: pricingRuleId,
      },
    });

  if (!existingRule) {
    throw new AppError(
      "Pricing rule not found",
      404
    );
  }

  if (
    data.unitPrice !== undefined &&
    data.unitPrice < 0
  ) {
    throw new AppError(
      "Unit price cannot be negative",
      400
    );
  }

  if (data.name) {
    const duplicateRule =
      await prisma.pricingRule.findFirst({
        where: {
          category: existingRule.category,
          name: data.name,
          NOT: {
            id: pricingRuleId,
          },
        },
      });

    if (duplicateRule) {
      throw new AppError(
        "A pricing rule with this name already exists for this category",
        409
      );
    }
  }

  return prisma.pricingRule.update({
    where: {
      id: pricingRuleId,
    },
    data: {
      ...(data.name !== undefined && {
        name: data.name,
      }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
      ...(data.unit !== undefined && {
        unit: data.unit,
      }),
      ...(data.unitPrice !== undefined && {
        unitPrice: data.unitPrice,
      }),
    },
  });
}

/**
 * Activate or deactivate a pricing rule.
 */
export async function updatePricingRuleStatus(
  pricingRuleId: string,
  isActive: boolean
) {
  const existingRule =
    await prisma.pricingRule.findUnique({
      where: {
        id: pricingRuleId,
      },
    });

  if (!existingRule) {
    throw new AppError(
      "Pricing rule not found",
      404
    );
  }

  return prisma.pricingRule.update({
    where: {
      id: pricingRuleId,
    },
    data: {
      isActive,
    },
  });
}

/**
 * Get all services in the service catalog.
 *
 * Used by the admin dashboard to manage/view
 * the available service offerings.
 */
export async function getServices() {
  return prisma.service.findMany({
    orderBy: [
      { category: "asc" },
      { name: "asc" },
    ],
  });
}

/**
 * Get a single service by ID.
 */
export async function getServiceById(
  serviceId: string
) {
  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  });

  if (!service) {
    throw new AppError(
      "Service not found",
      404
    );
  }

  return service;
}

/**
 * Update a service's catalog information.
 */
export async function updateService(
  serviceId: string,
  data: {
    name?: string;
    description?: string;
    pricingType?: "FIXED" | "CALCULATED" | "QUOTE";
    basePrice?: number | null;
    duration?: number | null;
  }
) {
  const existingService =
    await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    });

  if (!existingService) {
    throw new AppError(
      "Service not found",
      404
    );
  }

  if (
    data.basePrice !== undefined &&
    data.basePrice !== null &&
    data.basePrice < 0
  ) {
    throw new AppError(
      "Base price cannot be negative",
      400
    );
  }

  if (
    data.duration !== undefined &&
    data.duration !== null &&
    data.duration <= 0
  ) {
    throw new AppError(
      "Duration must be greater than zero",
      400
    );
  }

  if (data.name) {
    const duplicateService =
      await prisma.service.findFirst({
        where: {
          name: data.name,
          category: existingService.category,
          NOT: {
            id: serviceId,
          },
        },
      });

    if (duplicateService) {
      throw new AppError(
        "A service with this name already exists in this category",
        409
      );
    }
  }

  return prisma.service.update({
    where: {
      id: serviceId,
    },
    data: {
      ...(data.name !== undefined && {
        name: data.name,
      }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
      ...(data.pricingType !== undefined && {
        pricingType: data.pricingType,
      }),
      ...(data.basePrice !== undefined && {
        basePrice: data.basePrice,
      }),
      ...(data.duration !== undefined && {
        duration: data.duration,
      }),
    },
  });
}

/**
 * Activate or deactivate a service.
 *
 * We intentionally do not delete services because
 * existing bookings may reference them.
 */
export async function updateServiceStatus(
  serviceId: string,
  isActive: boolean
) {
  const existingService =
    await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    });

  if (!existingService) {
    throw new AppError(
      "Service not found",
      404
    );
  }

  return prisma.service.update({
    where: {
      id: serviceId,
    },
    data: {
      isActive,
    },
  });
}