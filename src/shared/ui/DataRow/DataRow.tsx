import React from "react";

interface Props {
  label: string;
  value: string | number;
  bold?: boolean;
}

export const DataRow: React.FC<Props> = ({ label, value, bold }) => {
  return (
    <div>
      <span className="select-none">{label}: </span>
      <span className={bold ? "font-bold" : "italic"}>{value}</span>
    </div>
  );
}
