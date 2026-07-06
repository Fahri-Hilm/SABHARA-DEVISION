import { z } from "zod";

export const memberRoleSchema = z.enum(["member", "admin"]);

export const memberSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  rank: z.string().max(50).nullable(),
  badge_number: z.string().max(50).nullable(),
  role: memberRoleSchema,
  is_active: z.boolean(),
  created_at: z.string(),
});

export const memberInsertSchema = z.object({
  name: z.string().min(1).max(100),
  rank: z.string().max(50).optional(),
  badge_number: z.string().max(50).optional(),
  role: memberRoleSchema.default("member"),
  is_active: z.boolean().default(true),
});

export const memberUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  rank: z.string().max(50).nullable().optional(),
  badge_number: z.string().max(50).nullable().optional(),
  role: memberRoleSchema.optional(),
  is_active: z.boolean().optional(),
});

export type Member = z.infer<typeof memberSchema>;
export type MemberInsert = z.infer<typeof memberInsertSchema>;
export type MemberUpdate = z.infer<typeof memberUpdateSchema>;
export type MemberRole = z.infer<typeof memberRoleSchema>;
