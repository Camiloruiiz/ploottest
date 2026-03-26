"use client";

import { useQuery } from "@tanstack/react-query";

type HealthcheckResponse = {
  ok: boolean;
  data: {
    items: unknown[];
    meta: { total: number };
  };
};

export function useHealthcheck() {
  return useQuery({
    queryKey: ["healthcheck", "products"],
    queryFn: async (): Promise<HealthcheckResponse> => {
      const response = await fetch("/api/v1/products");

      if (!response.ok) {
        throw new Error("Products endpoint is not ready.");
      }

      return response.json();
    },
  });
}
