import { Button } from "@/console";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <main className="p-10 container mx-auto">
      <header className="mt-20 flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold">
          Settings
        </h1>
      </header>
      <section className="mt-12">
        <h2 className="text-lg font-semibold">
          Members
        </h2>
        <p className="text-sm">
          Invite members to your organization.
        </p>
      </section>
      <section className="mt-12">
        <Link href="/signout">
          <Button
            variant="danger"
          >
            Sign out
          </Button>
        </Link>
      </section>
    </main>
  )
}