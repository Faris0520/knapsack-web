"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, Weight, Star, Pencil, Trash2, Plus, Shuffle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/Select";
import { ItemIcon } from "@/components/ItemIcon";
import { Item } from "@/types";

const PRESETS: { label: string; value: string; weight: number; points: number }[] = [
  { label: "Laptop", value: "laptop", weight: 3, points: 10 },
  { label: "Buku", value: "buku", weight: 2, points: 8 },
  { label: "Charger", value: "charger", weight: 1, points: 7 },
  { label: "Botol Minum", value: "botol-minum", weight: 1, points: 5 },
  { label: "Kotak Pensil", value: "kotak-pensil", weight: 1, points: 6 },
  { label: "Powerbank", value: "powerbank", weight: 1, points: 8 },
  { label: "Jaket", value: "jaket", weight: 2, points: 7 },
  { label: "Custom", value: "custom", weight: 0, points: 0 },
];

interface SidebarProps {
  items: Item[];
  capacity: number;
  onCapacityChange: (cap: number) => void;
  onAddItem: (item: Item) => void;
  onEditItem: (id: string, item: Partial<Item>) => void;
  onRemoveItem: (id: string) => void;
}

export function Sidebar({
  items,
  capacity,
  onCapacityChange,
  onAddItem,
  onEditItem,
  onRemoveItem,
}: SidebarProps) {
  const [selectedPreset, setSelectedPreset] = useState("kotak-pensil");
  const [customName, setCustomName] = useState("");
  const [customWeight, setCustomWeight] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editValue, setEditValue] = useState("");

  const isCustom = selectedPreset === "custom";
  const preset = PRESETS.find((p) => p.value === selectedPreset);

  function handleAdd() {
    if (isCustom) {
      if (!customName || !customWeight || !customValue) return;
      onAddItem({
        id: crypto.randomUUID(),
        name: customName,
        weight: Number(customWeight),
        value: Number(customValue),
      });
      setCustomName("");
      setCustomWeight("");
      setCustomValue("");
    } else if (preset) {
      onAddItem({
        id: crypto.randomUUID(),
        name: preset.label,
        weight: preset.weight,
        value: preset.points,
      });
    }
  }

  function handleRandom() {
    const available = PRESETS.filter((p) => p.value !== "custom");
    const random = available[Math.floor(Math.random() * available.length)];
    onAddItem({
      id: crypto.randomUUID(),
      name: random.label,
      weight: random.weight,
      value: random.points,
    });
  }

  function startEdit(item: Item) {
    setEditingId(item.id);
    setEditName(item.name);
    setEditWeight(String(item.weight));
    setEditValue(String(item.value));
  }

  function saveEdit(id: string) {
    onEditItem(id, {
      name: editName,
      weight: Number(editWeight),
      value: Number(editValue),
    });
    setEditingId(null);
  }

  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  const totalValue = items.reduce((sum, i) => sum + i.value, 0);

  return (
    <aside className="w-[340px] shrink-0 flex flex-col gap-4 overflow-y-auto max-h-screen p-4">
      <div className="flex items-center gap-2 mb-2">
        <Image src="/items/tas.png" alt="Tas" width={40} height={40} />
        <div>
          <h1 className="text-lg font-bold leading-tight">Knapsack Optimizer</h1>
          <p className="text-xs text-muted">Dashboard Interaktif</p>
        </div>
      </div>

      <Card>
        <label className="text-xs font-medium text-muted">Maksimum berat (kg)</label>
        <Input
          type="number"
          min={1}
          suffix="kg"
          value={capacity || ""}
          onChange={(e) => onCapacityChange(Number(e.target.value))}
          placeholder="10"
        />
      </Card>

      <Card className="space-y-3">
        <h3 className="text-sm font-semibold">Kelola Barang</h3>
        <Select
          options={PRESETS.map((p) => ({ label: p.label, value: p.value }))}
          value={selectedPreset}
          onChange={(e) => setSelectedPreset(e.target.value)}
        />
        {isCustom ? (
          <div className="space-y-2">
            <Input
              placeholder="Nama barang"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Berat"
              suffix="kg"
              value={customWeight}
              onChange={(e) => setCustomWeight(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Nilai"
              suffix="poin"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
            />
          </div>
        ) : (
          preset && (
            <div className="flex gap-4 text-xs text-muted">
              <span>Berat: {preset.weight} kg</span>
              <span>Nilai: {preset.points} poin</span>
            </div>
          )
        )}
        <div className="flex gap-2">
          <Button className="flex-1 gap-1" onClick={handleAdd}>
            <Plus className="size-4" />
            Tambah Barang
          </Button>
          <Button variant="outline" className="gap-1" onClick={handleRandom}>
            <Shuffle className="size-4" />
          </Button>
        </div>
      </Card>

      {items.length > 0 && (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-2 font-medium text-muted w-6"></th>
                  <th className="text-left p-2 font-medium text-muted">Nama</th>
                  <th className="text-center p-2 font-medium text-muted">Berat</th>
                  <th className="text-center p-2 font-medium text-muted">Nilai</th>
                  <th className="text-center p-2 font-medium text-muted">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-border/30 last:border-0">
                    {editingId === item.id ? (
                      <>
                        <td className="p-1.5">
                          <ItemIcon name={item.name} className="size-10" />
                        </td>
                        <td className="p-1.5">
                          <Input
                            className="text-xs py-1 px-1.5"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </td>
                        <td className="p-1.5">
                          <Input
                            type="number"
                            className="text-xs py-1 px-1.5 w-12 text-center"
                            value={editWeight}
                            onChange={(e) => setEditWeight(e.target.value)}
                          />
                        </td>
                        <td className="p-1.5">
                          <Input
                            type="number"
                            className="text-xs py-1 px-1.5 w-12 text-center"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                          />
                        </td>
                        <td className="p-1.5 text-center">
                          <div className="flex gap-1 justify-center">
                            <Button variant="ghost" className="px-1.5 py-0.5 text-xs" onClick={() => saveEdit(item.id)}>
                              OK
                            </Button>
                            <Button variant="ghost" className="px-1.5 py-0.5 text-xs" onClick={() => setEditingId(null)}>
                              ✕
                            </Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-1.5">
                          <ItemIcon name={item.name} className="size-6" />
                        </td>
                        <td className="p-2">{item.name}</td>
                        <td className="p-2 text-center">{item.weight} kg</td>
                        <td className="p-2 text-center">{item.value}</td>
                        <td className="p-2 text-center">
                          <div className="flex gap-1 justify-center">
                            <button
                              className="p-1 rounded hover:bg-gray-100 text-muted cursor-pointer"
                              onClick={() => startEdit(item)}
                              aria-label={`Edit ${item.name}`}
                            >
                              <Pencil className="size-3" />
                            </button>
                            <button
                              className="p-1 rounded hover:bg-red-50 text-destructive cursor-pointer"
                              onClick={() => onRemoveItem(item.id)}
                              aria-label={`Hapus ${item.name}`}
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center rounded-lg bg-card border border-border/50 p-2 shadow-sm">
          <Package className="size-4 text-primary mb-1" />
          <span className="text-lg font-bold">{items.length}</span>
          <span className="text-[10px] text-muted">Barang</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-card border border-border/50 p-2 shadow-sm">
          <Weight className="size-4 text-primary mb-1" />
          <span className="text-lg font-bold">{totalWeight}</span>
          <span className="text-[10px] text-muted">kg Total</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-card border border-border/50 p-2 shadow-sm">
          <Star className="size-4 text-primary mb-1" />
          <span className="text-lg font-bold">{totalValue}</span>
          <span className="text-[10px] text-muted">Poin Total</span>
        </div>
      </div>
    </aside>
  );
}
