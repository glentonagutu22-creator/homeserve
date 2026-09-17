import { prisma } from "../../config/prisma";

export async function getCleaningServices() {
  return prisma.service.findMany({
    where: {
      category: "CLEANING",
      isActive: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}