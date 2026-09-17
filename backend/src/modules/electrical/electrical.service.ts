import { prisma } from "../../config/prisma";

export async function getElectricalServices() {
  return prisma.service.findMany({
    where: {
      category: "ELECTRICAL",
      isActive: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}