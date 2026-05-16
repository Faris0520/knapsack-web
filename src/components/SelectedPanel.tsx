import { CheckCircle, Package } from "lucide-react";
import { ItemIcon } from "@/components/ItemIcon";
import { SolveResponse } from "@/types";

interface SelectedPanelProps {
  result: SolveResponse | null;
  capacity: number;
  isComplete: boolean;
}

export function SelectedPanel({ result, capacity, isComplete }: SelectedPanelProps) {
  const hasItems = isComplete && result && result.selected_items.length > 0;

  return (
    <aside className="w-[280px] shrink-0 flex flex-col gap-4 overflow-y-auto max-h-screen p-4">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle className="size-5 text-success" />
        <h2 className="text-base font-bold">Barang Terpilih</h2>
      </div>

      {!hasItems ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <Package className="size-12 text-gray-200 mb-3" />
          <p className="text-sm font-medium text-gray-400">Belum ada barang dipilih</p>
          <p className="text-xs text-muted mt-1">
            Mulai proses untuk memilih barang secara optimal.
          </p>
        </div>
      ) : (
        <div className="flex-1 space-y-2">
          {result.selected_items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border/50 bg-card p-3 shadow-sm"
            >
              <ItemIcon name={item.name} className="size-8" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-[10px] text-muted">
                  {item.weight} kg · {item.value} poin
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasItems && (
        <div className="border-t border-border/50 pt-3 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted">Kapasitas Terpakai</span>
            <span className="font-medium">{result.total_weight} kg / {capacity} kg</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted">Total Nilai</span>
            <span className="font-medium">{result.total_value} poin</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted">Jumlah Barang</span>
            <span className="font-medium">{result.selected_items.length} item</span>
          </div>
        </div>
      )}
    </aside>
  );
}
