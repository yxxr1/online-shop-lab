import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  inline?: boolean;
}

export const Button: React.FC<Props> = ({ children, className, inline, ...props }) => {
  return (
    <button
      {...props}
      className={`${inline ? "px-[2px] " : "block p-2 "}border-solid border-1 rounded-md border-gray-500 cursor-pointer bg-emerald-900/50 hover:bg-emerald-900/30 dark:bg-emerald-900/70 dark:hover:bg-emerald-900/50 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
