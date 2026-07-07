"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

type TimeSelectProps = {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
};

const PERIODE_BY_HOUR: Record<number, string> = {
  0: "Tengah Malam",
  1: "Dini Hari",
  2: "Dini Hari",
  3: "Dini Hari",
  4: "Subuh",
  5: "Subuh",
  6: "Pagi",
  7: "Pagi",
  8: "Pagi",
  9: "Pagi",
  10: "Pagi",
  11: "Pagi",
  12: "Siang",
  13: "Siang",
  14: "Siang",
  15: "Siang",
  16: "Sore",
  17: "Sore",
  18: "Sore",
  19: "Malam",
  20: "Malam",
  21: "Malam",
  22: "Malam",
  23: "Malam",
};

function isValidTime(value: string): boolean {
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
}

function getPeriode(value: string): string {
  const match = value.match(/^(\d{1,2}):/);
  if (!match) return "";
  const hour = parseInt(match[1]!, 10);
  if (isNaN(hour) || hour < 0 || hour > 23) return "";
  return PERIODE_BY_HOUR[hour] ?? "";
}

function formatTime(value: string): string {
  const match = value.match(/^(\d{1,2}):(\d{1,2})$/);
  if (!match) return value;
  const h = match[1]!.padStart(2, "0");
  const m = match[2]!.padStart(2, "0");
  return `${h}:${m}`;
}

export function TimeSelect({ name, label, defaultValue = "08:00", required }: TimeSelectProps) {
  const [value, setValue] = useState(defaultValue);
  const [touched, setTouched] = useState(false);
  const periode = getPeriode(value);
  const invalid = touched && !isValidTime(value);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let v = e.target.value.replace(/[^\d:]/g, "");
    if (v.length === 2 && !v.includes(":") && !value.includes(":")) {
      v = v + ":";
    }
    if (v.length > 5) v = v.slice(0, 5);
    setValue(v);
  }

  function handleBlur() {
    setTouched(true);
    if (isValidTime(value)) {
      setValue(formatTime(value));
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={name}>{label}</Label>
        {periode && (
          <span className="text-[10px] font-mono text-cyan/70">{periode}</span>
        )}
      </div>
      <div className="relative">
        <Clock className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={name}
          name={name}
          type="text"
          inputMode="numeric"
          pattern="[0-9]{2}:[0-9]{2}"
          placeholder="HH:MM"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          autoComplete="off"
          maxLength={5}
          className={`pl-8 font-mono ${invalid ? "border-destructive" : ""}`}
          aria-invalid={invalid}
        />
      </div>
      {invalid && (
        <p className="text-xs text-destructive">Format jam HH:MM, contoh 08:15</p>
      )}
      <p className="text-[10px] text-muted-foreground/70">
        Jam 00-23, menit 00-59
      </p>
    </div>
  );
}
