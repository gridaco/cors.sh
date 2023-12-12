import Link from "next/link";

export default function SettingsPage() {
  return (
    <main className="p-10">
      <header className="mt-20 flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold">
          Settings
        </h1>
      </header>
      <section>
        <Link href="/signout">
          <button
            className="px-5 py-3 rounded-md text-red-500 bg-red-50"
          >
            Sign out
          </button>
        </Link>
      </section>
    </main>
  )
}