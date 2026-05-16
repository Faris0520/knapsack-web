import { SolveRequest, SolveResponse } from "@/types";

const API_URL = "https://knapsack-web-wix4.vercel.app/"

export async function solveKnapsack(request: SolveRequest): Promise<SolveResponse> {
  const res = await fetch(`${API_URL}/solve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error("Failed to solve knapsack");
  }

  return res.json();
}
