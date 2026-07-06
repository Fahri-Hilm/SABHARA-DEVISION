import { z } from "zod";

export const dutyPhotoSchema = z.object({
  id: z.string().uuid(),
  duty_report_id: z.string().uuid(),
  storage_path: z.string().nullable(),
  original_size: z.number().int().nullable(),
  compressed_size: z.number().int().nullable(),
  created_at: z.string(),
  deleted_at: z.string().nullable(),
});

export const dutyPhotoInsertSchema = z.object({
  duty_report_id: z.string().uuid(),
  storage_path: z.string(),
  original_size: z.number().int(),
  compressed_size: z.number().int(),
});

export type DutyPhoto = z.infer<typeof dutyPhotoSchema>;
export type DutyPhotoInsert = z.infer<typeof dutyPhotoInsertSchema>;
