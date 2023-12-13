export function Form({ children }: React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form className="flex flex-col bg-neutral-50 dark:bg-neutral-900 shadow-lg border rounded-md">
      {children}
    </form>
  )
}

export function FormHeader({ children }: React.PropsWithChildren<{}>) {
  return (
    <header className="px-6 py-4 flex flex-col items-start border-b">
      {/* default title style */}
      <span className="text-md font-medium">
        {children}
      </span>
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

export function FormRow({ label, children, noborder }: React.PropsWithChildren<{
  label?: string | React.ReactNode
  noborder?: boolean
}>) {
  {
    return (
      <div className="px-6 py-4 flex flex-row border-b" style={{
        border: noborder ? "none" : undefined
      }}>
        {label && <h6 className="text-sm opacity-50 flex-[4]">
          {label}
        </h6>}
        <div className="flex-[6]">
          {children}
        </div>
      </div>
    )
  }
}