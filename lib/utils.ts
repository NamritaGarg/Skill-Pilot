import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format USD cost cleanly with up to 6 decimal places for micro-costs
 */
export function formatCost(costInUSD: number): string {
  if (costInUSD === 0) return "$0.000000";
  if (costInUSD < 0.00001) return `< $0.00001`;
  return `$${costInUSD.toFixed(6)}`;
}

/**
 * Format integer token count with commas
 */
export function formatTokens(tokens: number): string {
  return tokens.toLocaleString();
}

/**
 * Format latency in milliseconds or seconds
 */
export function formatLatency(latencyMs: number): string {
  if (latencyMs < 1000) {
    return `${latencyMs}ms`;
  }
  return `${(latencyMs / 1000).toFixed(2)}s`;
}
