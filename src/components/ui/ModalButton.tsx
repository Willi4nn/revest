import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function ModalButton({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={
        'rounded-xl p-3 text-white transition hover:bg-white/10 cursor-pointer ' +
        (className || '')
      }
    >
      {children}
    </button>
  );
}
