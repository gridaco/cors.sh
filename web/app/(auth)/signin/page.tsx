import Image from "next/image"
import Link from "next/link"
import React from "react"

export default function Login() {
  return (
    <main className="min-h-screen max-w-screen-sm m-auto p-6 pt-20">
      <h1 className="text-5xl font-bold">Login</h1>
      <form
        className="flex flex-col gap-8 mt-20"
        action="/auth/login" method="post">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm">Email</label>
            <input minLength={4} name="email" className="border border-gray-300 rounded p-4 dark:bg-neutral-900" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm">Password</label>
            <input type="password" name="password" className="border border-gray-300 rounded p-4 dark:bg-neutral-900" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <button className="rounded p-4 font-bold bg-neutral-950 dark:bg-neutral-50 text-white dark:text-black">Sign In</button>
        </div>
      </form>
    </main>
  )
}
