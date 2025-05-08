"use client";

import React from "react";

interface FormPageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function FormPageLayout({ children, className }: FormPageLayoutProps) {
  return (
    <div
      className={`font-sans flex flex-col mx-auto items-center justify-center max-w-[320px] min-h-screen ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

interface FormPageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function FormPageTitle({ children, className }: FormPageTitleProps) {
  return <h1 className={`text-center ${className ?? ""}`}>{children}</h1>;
}

interface FormPageDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function FormPageDescription({
  children,
  className,
}: FormPageDescriptionProps) {
  return <p className={`text-center mt-4 ${className ?? ""}`}>{children}</p>;
}

interface FormPageBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function FormPageBody({ children, className }: FormPageBodyProps) {
  return (
    <div className={`flex flex-col gap-5 w-full ${className ?? ""}`}>
      {children}
    </div>
  );
}

interface FormPageFormProps {
  children: React.ReactNode;
  className?: string;
}

export function FormPageForm({ children, className }: FormPageFormProps) {
  return (
    <div className={`mt-15 flex flex-col gap-5 w-full ${className ?? ""}`}>
      {children}
    </div>
  );
}

interface FormPageCloseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function FormPageCloseButton({
  className,
  ...props
}: FormPageCloseButtonProps) {
  return (
    <button
      className={`absolute top-4 right-4 m-0 p-1 bg-transparent border-none cursor-pointer text-muted-foreground hover:text-foreground ${className ?? ""}`}
      {...props}
    />
  );
}
