import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
}

export const Input: React.FC<Props> = ({ label, className, ...props }) => {
  return (
    <div className="my-2">
      <span className="select-none">{label}: </span>
      <input
        {...props}
        className={`border-1 border-gray-300 rounded-sm${className ? " " + className : ""}`}
      />
    </div>
  );
}
