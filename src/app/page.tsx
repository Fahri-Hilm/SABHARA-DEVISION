import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
        Kepolisian Futuristic Sabhara Devision
      </h1>
      <p className="text-sm text-neutral-500">Coming Soon</p>
      <Link
        href="/login"
        className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
      >
        Login
      </Link>
    </main>
  );
}
