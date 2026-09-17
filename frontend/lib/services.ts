import type { Service } from "@/types/service";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001/api";

export async function getServicesByCategory(
  category: "cleaning" | "moving" | "electrical"
): Promise<Service[]> {
  const response = await fetch(
    `${API_URL}/${category}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${category} services`
    );
  }

  const data = await response.json();

  return data.services;
}