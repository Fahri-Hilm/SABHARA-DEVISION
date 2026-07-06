import { z } from "zod";

export const dutyReportStatusFilterSchema = z.enum(["pending", "approved", "rejected"]);

export const feedFilterSchema = z
  .object({
    member_id: z.string().uuid().optional(),
    status: dutyReportStatusFilterSchema.optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional(),
  })
  .refine(
    (data) => !data.date_from || !data.date_to || new Date(data.date_from) <= new Date(data.date_to),
    {
      message: "date_from harus sebelum atau sama dengan date_to",
      path: ["date_to"],
    },
  );

export type FeedFilter = z.infer<typeof feedFilterSchema>;
