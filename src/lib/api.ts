import { SolveRequest, SolveResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function solveKnapsack(request: SolveRequest): Promise<SolveResponse> {
  const res = await fetch(`${API_URL}/knapsack/solve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error("Failed to solve knapsack");
  }

  return res.json();
}
