"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Stepper } from "@/components/Stepper";
import { SimulationArea } from "@/components/SimulationArea";
import { DPTable } from "@/components/DPTable";
import { SelectedPanel } from "@/components/SelectedPanel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { solveKnapsack } from "@/lib/api";
import { Item, SolveResponse } from "@/types";

const STEPS = ["Mulai", "Evaluasi Barang", "Hasil Optimal"];

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [capacity, setCapacity] = useState(10);
  const [result, setResult] = useState<SolveResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [currentEvalItem, setCurrentEvalItem] = useState(0);
  const [dpProgress, setDpProgress] = useState({ weight: 0, value: 0 });

  function handleAddItem(item: Item) {
    setItems((prev) => [...prev, item]);
    setResult(null);
    setCurrentStep(0);
  }

  function handleEditItem(id: string, updates: Partial<Item>) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    setResult(null);
    setCurrentStep(0);
  }

  function handleRemoveItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setResult(null);
    setCurrentStep(0);
  }

  async function handleStart() {
    if (items.length === 0 || capacity <= 0) return;

    setLoading(true);
    setError("");
    setCurrentStep(1);
    try {
      const response = await solveKnapsack({
        capacity,
        items: items.map(({ name, weight, value }) => ({ name, weight, value })),
      });
      setResult(response);
    } catch {
      setError("Gagal menghubungi server. Pastikan backend berjalan.");
      setCurrentStep(0);
    } finally {
      setLoading(false);
    }
  }

  function handlePrev() {
    setCurrentStep((s) => Math.max(0, s - 1));
  }

  function handleNext() {
    setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1));
  }

  function handleDPStepChange(step: number, totalSteps: number) {
    if (step === 0) {
      setCurrentEvalItem(0);
      setDpProgress({ weight: 0, value: 0 });
      setCurrentStep(1);
    } else if (step < totalSteps) {
      const row = Math.floor((step - 1) / (capacity + 1));
      const col = (step - 1) % (capacity + 1);
      setCurrentEvalItem(row);

      if (result) {
        const currentValue = result.dp_table[row + 1][col];
        let usedWeight = 0;
        let tempW = col;
        for (let i = row + 1; i >= 1; i--) {
          if (result.dp_table[i][tempW] !== result.dp_table[i - 1][tempW]) {
            usedWeight += items[i - 1].weight;
            tempW -= items[i - 1].weight;
          }
        }
        setDpProgress({ weight: usedWeight, value: currentValue });
      }

      setCurrentStep(1);
    } else {
      if (result) {
        setDpProgress({ weight: result.total_weight, value: result.total_value });
      }
      setCurrentStep(2);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        items={items}
        capacity={capacity}
        onCapacityChange={setCapacity}
        onAddItem={handleAddItem}
        onEditItem={handleEditItem}
        onRemoveItem={handleRemoveItem}
      />

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <Card className="p-5">
          <Stepper currentStep={currentStep} steps={STEPS} />
        </Card>

        <Card className="p-5">
          <SimulationArea
            step={currentStep}
            items={items}
            capacity={capacity}
            result={result}
            currentEvalItem={currentEvalItem}
            usedWeight={dpProgress.weight}
            usedValue={dpProgress.value}
          />
        </Card>

        <div className="flex gap-2">
          {currentStep === 0 ? (
            <Button
              onClick={handleStart}
              disabled={loading || items.length === 0 || capacity <= 0}
            >
              {loading ? "Memproses..." : "Mulai Proses"}
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handlePrev} disabled={currentStep <= 0}>
                Sebelumnya
              </Button>
              <Button variant="outline" onClick={handleNext} disabled={currentStep >= STEPS.length - 1}>
                Selanjutnya
              </Button>
            </>
          )}
        </div>

        {error && (
          <p className="text-destructive text-sm">{error}</p>
        )}

        {result && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-3">Matriks DP</h3>
            <DPTable
              dpTable={result.dp_table}
              items={items}
              capacity={capacity}
              selectedItems={result.selected_items}
              onStepChange={handleDPStepChange}
            />
          </Card>
        )}
      </main>

      <SelectedPanel result={result} capacity={capacity} isComplete={currentStep === 2} />
    </div>
  );
}
