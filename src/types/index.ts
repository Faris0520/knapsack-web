export interface Item {
  id: string;
  name: string;
  weight: number;
  value: number;
  image?: string;
}

export interface SolveRequest {
  capacity: number;
  items: { name: string; weight: number; value: number }[];
}

export interface SolveResponse {
  dp_table: number[][];
  selected_items: { name: string; weight: number; value: number }[];
  total_weight: number;
  total_value: number;
}
