import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TimeSelectProps = {
  name: string;
  defaultValue?: string;
  required?: boolean;
};

const HOURS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = (i % 2) * 30;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
});

const LABELS: Record<string, string> = {
  "06:00": "Pagi (06:00)",
  "07:00": "Pagi (07:00)",
  "08:00": "Pagi (08:00)",
  "12:00": "Siang (12:00)",
  "13:00": "Siang (13:00)",
  "16:00": "Sore (16:00)",
  "17:00": "Sore (17:00)",
  "18:00": "Sore (18:00)",
  "19:00": "Malam (19:00)",
  "20:00": "Malam (20:00)",
  "22:00": "Malam (22:00)",
  "23:00": "Malam (23:00)",
  "00:00": "Tengah Malam (00:00)",
};

export function TimeSelect({ name, defaultValue, required }: TimeSelectProps) {
  return (
    <Select name={name} defaultValue={defaultValue} required={required}>
      <SelectTrigger id={name} className="w-full">
        <SelectValue placeholder="Pilih jam" />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {HOURS.map((h) => (
          <SelectItem key={h} value={h}>
            {LABELS[h] ?? h}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
