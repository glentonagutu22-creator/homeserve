import { apiRequest } from "./api";

import type {
  Quote,
  QuoteResponse,
  QuotesResponse,
} from "@/types/quote";

export interface UpdateAdminQuoteData {
  estimatedAmount?: number;
  finalAmount?: number;
  description?: string;
  validUntil?: string;
}

/*
|--------------------------------------------------------------------------
| Customer
|--------------------------------------------------------------------------
*/

export async function getQuotes(): Promise<Quote[]> {
  const response =
    await apiRequest<QuotesResponse>("/quotes");

  return response.quotes;
}

export async function getQuote(
  id: string
): Promise<Quote> {
  const response =
    await apiRequest<QuoteResponse>(
      `/quotes/${id}`
    );

  return response.quote;
}

export async function acceptQuote(
  id: string
): Promise<Quote> {
  const response =
    await apiRequest<QuoteResponse>(
      `/quotes/${id}/accept`,
      {
        method: "POST",
      }
    );

  return response.quote;
}

export async function rejectQuote(
  id: string
): Promise<Quote> {
  const response =
    await apiRequest<QuoteResponse>(
      `/quotes/${id}/reject`,
      {
        method: "POST",
      }
    );

  return response.quote;
}

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

export async function getAdminQuotes(): Promise<
  Quote[]
> {
  const response =
    await apiRequest<QuotesResponse>(
      "/quotes/admin"
    );

  return response.quotes;
}

export async function getAdminQuote(
  id: string
): Promise<Quote> {
  const response =
    await apiRequest<QuoteResponse>(
      `/quotes/admin/${id}`
    );

  return response.quote;
}

export async function updateAdminQuote(
  id: string,
  data: UpdateAdminQuoteData
): Promise<Quote> {
  const response =
    await apiRequest<QuoteResponse>(
      `/quotes/admin/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );

  return response.quote;
}
export async function sendAdminQuote(
  id: string
): Promise<Quote> {
  const response =
    await apiRequest<QuoteResponse>(
      `/quotes/${id}/send`,
      {
        method: "POST",
      }
    );

  return response.quote;
}