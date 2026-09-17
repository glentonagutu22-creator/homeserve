import { prisma } from "../../config/prisma";

export async function getMovingServices() {
  return prisma.service.findMany({
    where: {
      category: "MOVING",
      isActive: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}