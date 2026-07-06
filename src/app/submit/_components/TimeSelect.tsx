"use client";

import { useState, useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

type TimeSelectProps = {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
};

const HOURS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = (i % 2) * 30;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
});

const PERIODE_LABEL: Record<string, string> = {
  "00:00": "Tengah Malam",
  "01:00": "Dini Hari",
  "02:00": "Dini Hari",
  "03:00": "Dini Hari",
  "04:00": "Subuh",
  "05:00": "Subuh",
  "06:00": "Pagi",
  "07:00": "Pagi",
  "08:00": "Pagi",
  "09:00": "Pagi",
  "10:00": "Pagi",
  "11:00": "Pagi",
  "12:00": "Siang",
  "13:00": "Siang",
  "14:00": "Siang",
  "15:00": "Siang",
  "16:00": "Sore",
  "17:00": "Sore",
  "18:00": "Sore",
  "19:00": "Malam",
  "20:00": "Malam",
  "21:00": "Malam",
  "22:00": "Malam",
  "23:00": "Malam",
};

function isValidTime(value: string): boolean {
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
}

export function TimeSelect({ name, label, defaultValue = "08:00", required }: TimeSelectProps) {
  const listId = useId();
  const [value, setValue] = useState(defaultValue);
  const [touched, setTouched] = useState(false);
  const periode = PERIODE_LABEL[value] ?? "";
  const invalid = touched && !isValidTime(value);

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
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
          list={listId}
          required={required}
          autoComplete="off"
          className={`pl-8 font-mono ${invalid ? "border-destructive" : ""}`}
          aria-invalid={invalid}
        />
        <datalist id={listId}>
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {PERIODE_LABEL[h] ? `${PERIODE_LABEL[h]} ${h}` : h}
            </option>
          ))}
        </datalist>
      </div>
      {invalid && (
        <p className="text-xs text-destructive">Format jam HH:MM, contoh 08:00</p>
      )}
      <p className="text-[10px] text-muted-foreground/70">
        Ketik manual atau pilih dari daftar
      </p>
    </div>
  );
}
