import { Request } from "express";

export function headerfrom(
  headers: Request["headers"],
  key: string | string[]
): string | null {
  const keys = Array.isArray(key) ? key : [key];
  for (const k of keys) {
    const v = headers[k];
    if (v) {
      return v as string;
    }
  }
  return null;
}
