import Link from "next/link";
import type { ComponentType, ReactNode } from "react";

type ButtonTone = "primary" | "secondary" | "ghost";

type ButtonBaseProps = {
  children: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  tone?: ButtonTone;
};

type ButtonLinkProps = ButtonBaseProps & {
  href: string;
};

type ButtonProps = ButtonBaseProps & {
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
};

const toneClassName: Record<ButtonTone, string> = {
  primary:
    "border-teal-700 bg-teal-700 text-white shadow-sm shadow-teal-900/10 hover:bg-teal-800 dark:border-teal-500 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400",
  secondary:
    "border-slate-300 bg-white text-slate-800 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
  ghost:
    "border-transparent bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
};

function ButtonContent({
  children,
  icon: Icon,
}: Pick<ButtonBaseProps, "children" | "icon">) {
  return (
    <>
      {Icon ? <Icon className="h-4 w-4" /> : null}
      <span>{children}</span>
    </>
  );
}

export function ButtonLink({
  href,
  children,
  icon,
  tone = "secondary",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-500/40 ${toneClassName[tone]}`}
    >
      <ButtonContent icon={icon}>{children}</ButtonContent>
    </Link>
  );
}

export function Button({
  children,
  disabled = false,
  icon,
  onClick,
  tone = "secondary",
  type = "button",
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-500/40 disabled:cursor-not-allowed disabled:opacity-60 ${toneClassName[tone]}`}
    >
      <ButtonContent icon={icon}>{children}</ButtonContent>
    </button>
  );
}
