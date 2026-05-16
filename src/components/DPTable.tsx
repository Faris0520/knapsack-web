"use client";

import { useState, useEffect, useRef } from "react";
import { Item } from "@/types";
import { cn } from "@/lib/utils";

interface DPTableProps {
  dpTable: number[][];
  items: Item[];
  capacity: number;
  selectedItems?: { name: string; weight: number; value: number }[];
  onStepChange?: (step: number, totalSteps: number) => void;
}

export function DPTable({ dpTable, items, capacity, selectedItems, onStepChange }: DPTableProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSteps = items.length * (capacity + 1);
  const isComplete = currentStep >= totalSteps;

  function getRowCol(step: number) {
    const row = Math.floor(step / (capacity + 1)) + 1;
    const col = step % (capacity + 1);
    return { row, col };
  }

  function isCellVisible(row: number, col: number) {
    if (row === 0) return true;
    const stepForCell = (row - 1) * (capacity + 1) + col;
    return stepForCell < currentStep;
  }

  function isCellActive(row: number, col: number) {
    if (currentStep === 0 || currentStep > totalSteps) return false;
    const { row: activeRow, col: activeCol } = getRowCol(currentStep - 1);
    return row === activeRow && col === activeCol;
  }

  function isOptimalPath(row: number, col: number) {
    if (!isComplete || !selectedItems) return false;
    let w = capacity;
    const selectedSet = new Set<number>();
    for (let i = items.length; i >= 1; i--) {
      if (dpTable[i][w] !== dpTable[i - 1][w]) {
        selectedSet.add(i);
        w -= items[i - 1].weight;
      }
    }
    if (selectedSet.has(row) && col === capacity) return true;
    return false;
  }

  function handleNext() {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  }

  function handleAutoPlay() {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setCurrentStep((s) => {
          if (s >= totalSteps) {
            clearInterval(intervalRef.current!);
            setIsPlaying(false);
            return s;
          }
          return s + 1;
        });
      }, 500);
    }
  }

  function handleReset() {
    setCurrentStep(0);
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  useEffect(() => {
    onStepChange?.(currentStep, totalSteps);
  }, [currentStep]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted">
          Step {currentStep} / {totalSteps}
        </span>
        {isComplete && (
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-medium">
            Selesai
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/50">
        <table className="border-collapse text-xs w-full">
          <thead>
            <tr>
              <th className="border-b border-r border-border/50 p-1.5 bg-gray-50 text-muted font-medium text-[10px]">
                Item \ Cap
              </th>
              {Array.from({ length: capacity + 1 }, (_, j) => (
                <th key={j} className="border-b border-border/50 p-1.5 bg-gray-50 text-muted font-medium text-[10px]">
                  {j}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dpTable.map((row, i) => (
              <tr key={i}>
                <td className="border-b border-r border-border/50 p-1.5 font-medium bg-gray-50 text-[10px] text-muted whitespace-nowrap">
                  {i === 0 ? "∅" : items[i - 1]?.name}
                </td>
                {row.map((cell, j) => {
                  const visible = isCellVisible(i, j);
                  const active = isCellActive(i, j);
                  const optimal = isOptimalPath(i, j);
                  return (
                    <td
                      key={j}
                      className={cn(
                        "border-b border-border/30 p-1.5 text-center text-[11px] transition-colors",
                        active && "bg-green-200 font-bold",
                        !active && optimal && "bg-blue-100 font-semibold",
                        !active && !optimal && visible && "bg-white",
                        !active && !optimal && !visible && i !== 0 && "bg-gray-50"
                      )}
                    >
                      {visible || i === 0 ? cell : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleNext}
          disabled={isComplete}
          className="px-3 py-1.5 text-xs rounded-lg bg-primary text-white disabled:opacity-50 disabled:pointer-events-none cursor-pointer hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
        <button
          onClick={handleAutoPlay}
          className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-gray-50 cursor-pointer transition-colors"
        >
          {isPlaying ? "Pause" : "Auto Play"}
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-xs rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
