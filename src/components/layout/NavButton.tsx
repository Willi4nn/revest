import type { ButtonHTMLAttributes, ReactNode } from "react";

interface NavButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  children: ReactNode;
  variant?: 'default' | 'primary';
}

export function NavButton({
  icon,
  children,
  variant = 'default',
  className = '',
  ...props
}: NavButtonProps) {

  const baseStyles = "flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer";

  const variants = {
    default: "text-slate-300 hover:bg-white/10 hover:text-white",
    primary: "text-indigo-300 hover:bg-indigo-600/20 hover:text-white"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}