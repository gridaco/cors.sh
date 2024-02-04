import Link from "next/link";

export default function EmailDevPage() {
  return <main>
    <Link href="/dev/emails/onboarding">
      Onboarding Email
    </Link>
    <br />
    <Link href="/dev/emails/payment-success">
      Payment Success Email
    </Link>
  </main>
}