export function Form({ children }: React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form className="flex flex-col gap-4 bg-white shadow-lg border rounded-md">
      {children}
    </form>
  )
}

export function FormHeader({ children }: React.PropsWithChildren<{}>) {
  return (
    <header className="px-6 py-4 flex flex-col items-start border-b">
      {children}
    </header>
  )
}

export function FormFooter({ children }: React.PropsWithChildren<{}>) {
  return (
    <footer className="px-6 py-4 border-t">
      {children}
    </footer>
  )
}

export function FormButton({ variant = 'primary', children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary"
}) {
  return (
    <button
      data-variant={variant}
      className="rounded-md px-3 py-2 text-xs font-medium border bg-neutral-100 data-[variant=primary]:bg-black data-[variant=primary]:text-white data-[variant=primary]:dark:bg-white data-[variant=primary]:dark:text-black"
      {...props}
    >
      {children}
    </button>
  )
}

export function FormRow({ label, children, noborder }: React.PropsWithChildren<{
  label?: string | React.ReactNode
  noborder?: boolean
}>) {
  {
    return (
      <div className="px-6 py-4 flex flex-row border-b" style={{
        border: noborder ? "none" : undefined
      }}>
        <h6 className="text-sm opacity-50 flex-[4]">
          {label}
        </h6>
        <div className="flex-[6]">
          {children}
        </div>
      </div>
    )

  }
}