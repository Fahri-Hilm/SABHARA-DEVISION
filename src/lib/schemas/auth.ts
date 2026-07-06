import { z } from "zod";

export const memberLoginSchema = z.object({
  code: z.string().min(1, "Kode akses wajib diisi"),
});

export const adminMagicLinkSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

export const authSessionSchema = z.object({
  role: z.enum(["member", "admin"]),
  member_id: z.string().uuid().nullable(),
  exp: z.number(),
});

export type MemberLogin = z.infer<typeof memberLoginSchema>;
export type AdminMagicLink = z.infer<typeof adminMagicLinkSchema>;
export type AuthSession = z.infer<typeof authSessionSchema>;
