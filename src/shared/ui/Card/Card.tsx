import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<Props> = ({ children, className, hover }) => {
  return (
    <div className={`p-3 border-solid border-1 border-gray-300 dark:border-gray-500 rounded-md${hover ? ` hover:border-gray-500 dark:hover:border-gray-300` : ""}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
