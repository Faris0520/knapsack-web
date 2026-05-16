"use client";

import Image from "next/image";
import { Play, ClipboardList, ArrowRight, Trophy } from "lucide-react";
import { ItemIcon } from "@/components/ItemIcon";
import { Item, SolveResponse } from "@/types";

interface SimulationAreaProps {
  step: number;
  items: Item[];
  capacity: number;
  result: SolveResponse | null;
  currentEvalItem: number;
  usedWeight: number;
  usedValue: number;
}

export function SimulationArea({ step, items, capacity, result, currentEvalItem, usedWeight, usedValue }: SimulationAreaProps) {

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Play className="size-4 text-primary" />
        <div>
          <h3 className="text-sm font-semibold">Simulasi Langkah</h3>
          <p className="text-[11px] text-muted">
            Simulasi berjalan mengikuti algoritma mengevaluasi setiap barang.
          </p>
        </div>
      </div>

      {step === 0 && <StepMulai capacity={capacity} />}
      {step === 1 && <StepEvaluasi item={items[currentEvalItem]} capacity={capacity} usedWeight={usedWeight} usedValue={usedValue} />}
      {step === 2 && <StepHasil capacity={capacity} usedWeight={usedWeight} usedValue={usedValue} result={result} />}
    </div>
  );
}

function StepMulai({ capacity }: { capacity: number }) {
  return (
    <div className="flex items-center gap-4 min-h-[180px]">
      <div className="flex-1 rounded-xl border border-border/50 bg-gray-50/50 p-5 flex flex-col items-center justify-center text-center">
        <ClipboardList className="size-10 text-gray-300 mb-2" />
        <p className="font-medium text-sm">Siap memulai</p>
        <p className="text-xs text-muted">Belum ada barang yang dievaluasi</p>
      </div>

      <ArrowRight className="size-5 text-gray-300 shrink-0" />

      <div className="flex-1 rounded-xl border border-border/50 bg-gray-50/50 p-5 flex items-center gap-4">
        <div className="flex flex-col items-center">
          <p className="text-xs font-medium text-muted mb-2">Tas Saat Ini</p>
          <Image src="/items/tas.png" alt="Tas" width={140} height={140} />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-[11px] text-muted mb-1">Kapasitas Terpakai</p>
            <p className="text-sm font-bold">0 kg / {capacity} kg</p>
            <CapacityBar used={0} total={capacity} />
          </div>
          <div className="inline-block bg-blue-100 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
            0%
          </div>
          <div>
            <p className="text-[11px] text-muted">Nilai Saat Ini</p>
            <p className="text-sm font-bold">☆ 0 poin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepEvaluasi({ item, capacity, usedWeight, usedValue }: { item?: Item; capacity: number; usedWeight: number; usedValue: number }) {
  const pct = capacity > 0 ? Math.round((usedWeight / capacity) * 100) : 0;

  return (
    <div className="flex items-center gap-4 min-h-[180px]">
      <div className="flex-1 rounded-xl border border-border/50 bg-gray-50/50 p-5">
        <p className="text-xs font-medium text-primary mb-3">Barang yang Sedang Dievaluasi</p>
        {item ? (
          <div className="flex flex-col items-center text-center">
            <ItemIcon name={item.name} className="size-14 mb-2" />
            <p className="font-semibold text-sm">{item.name}</p>
            <div className="flex gap-3 mt-1 text-xs text-muted">
              <span>△ {item.weight} kg</span>
              <span>☆ {item.value} poin</span>
            </div>
            <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              Sedang dievaluasi
            </span>
          </div>
        ) : (
          <p className="text-xs text-muted text-center">Memulai evaluasi...</p>
        )}
      </div>

      <ArrowRight className="size-5 text-gray-400 shrink-0" />

      <div className="flex-1 rounded-xl border border-border/50 bg-gray-50/50 p-5 flex items-center gap-4">
        <div className="flex flex-col items-center">
          <p className="text-xs font-medium text-muted mb-2">Tas Saat Ini</p>
          <Image src="/items/tas.png" alt="Tas" width={140} height={140} />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-[11px] text-muted mb-1">Kapasitas Terpakai</p>
            <p className="text-sm font-bold">{usedWeight} kg / {capacity} kg</p>
            <CapacityBar used={usedWeight} total={capacity} />
          </div>
          <div className="inline-block bg-blue-100 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
            {pct}%
          </div>
          <div>
            <p className="text-[11px] text-muted">Nilai Saat Ini</p>
            <p className="text-sm font-bold">☆ {usedValue} poin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepHasil({ capacity, usedWeight, usedValue, result }: { capacity: number; usedWeight: number; usedValue: number; result: SolveResponse | null }) {
  const pct = capacity > 0 ? Math.round((usedWeight / capacity) * 100) : 0;

  return (
    <div className="flex gap-4 min-h-[180px]">
      <div className="flex-1 rounded-xl border border-green-200 bg-green-50/50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="size-5 text-success" />
          <p className="font-semibold text-sm">Solusi ditemukan!</p>
        </div>
        <p className="text-xs text-muted mb-3">
          Total nilai: {usedValue} poin | Kapasitas: {usedWeight}/{capacity} kg
        </p>
        {result && result.selected_items.length > 0 && (
          <div className="space-y-1.5">
            {result.selected_items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-white border border-green-200 px-2 py-1.5">
                <ItemIcon name={item.name} className="size-5" />
                <span className="text-xs font-medium">{item.name}</span>
                <span className="text-[10px] text-muted ml-auto">{item.weight} kg · {item.value} poin</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 rounded-xl border border-border/50 bg-gray-50/50 p-5 flex items-center gap-4">
        <div className="flex flex-col items-center">
          <p className="text-xs font-medium text-muted mb-2">Tas Saat Ini</p>
          <Image src="/items/tas.png" alt="Tas" width={140} height={140} />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-[11px] text-muted mb-1">Kapasitas Terpakai</p>
            <p className="text-sm font-bold">{usedWeight} kg / {capacity} kg</p>
            <CapacityBar used={usedWeight} total={capacity} />
          </div>
          <div className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {pct}%
          </div>
          <div>
            <p className="text-[11px] text-muted">Nilai Saat Ini</p>
            <p className="text-sm font-bold">☆ {usedValue} poin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CapacityBar({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  return (
    <div className="w-full mt-1">
      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
