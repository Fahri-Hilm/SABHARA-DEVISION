import { logoutAction } from "@/app/login/actions";

export async function POST() {
  await logoutAction();
  return Response.json({ ok: true });
}
