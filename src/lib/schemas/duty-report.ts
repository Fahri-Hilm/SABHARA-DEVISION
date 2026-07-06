import { z } from "zod";

export const dutyReportStatusSchema = z.enum(["pending", "approved", "rejected"]);

export const dutyReportSchema = z.object({
  id: z.string().uuid(),
  member_id: z.string().uuid(),
  duty_date: z.string(),
  on_duty_at: z.string().datetime(),
  off_duty_at: z.string().datetime(),
  status: dutyReportStatusSchema,
  reject_reason: z.string().nullable(),
  approved_by: z.string().uuid().nullable(),
  approved_at: z.string().nullable(),
  notes: z.string().max(1000).nullable(),
  created_at: z.string(),
  deleted_at: z.string().nullable(),
});

export const dutyReportInsertSchema = z
  .object({
    member_id: z.string().uuid(),
    duty_date: z.string(),
    on_duty_at: z.string().datetime(),
    off_duty_at: z.string().datetime(),
    notes: z.string().max(1000).optional(),
  })
  .refine((data) => new Date(data.off_duty_at) > new Date(data.on_duty_at), {
    message: "off_duty_at must be after on_duty_at",
    path: ["off_duty_at"],
  });

export const dutyReportApprovalSchema = z
  .object({
    report_id: z.string().uuid(),
    status: z.enum(["approved", "rejected"]),
    reject_reason: z.string().min(5).max(500).optional(),
  })
  .refine(
    (data) => data.status !== "rejected" || (data.reject_reason && data.reject_reason.length >= 5),
    {
      message: "reject_reason wajib diisi minimal 5 karakter saat menolak",
      path: ["reject_reason"],
    },
  );

export type DutyReport = z.infer<typeof dutyReportSchema>;
export type DutyReportInsert = z.infer<typeof dutyReportInsertSchema>;
export type DutyReportApproval = z.infer<typeof dutyReportApprovalSchema>;
export type DutyReportStatus = z.infer<typeof dutyReportStatusSchema>;
