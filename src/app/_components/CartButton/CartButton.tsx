"use client"

import React, {useState} from "react";
import {Button} from "@/shared/ui/Button";
import {Input} from "@/shared/ui/Input";

interface Props {
  id: string;
  byWeight: boolean;
  max: number;
  title: string;
  handler: (id: string, count: number) => void;
}

export const CartButton: React.FC<Props> = ({ id, byWeight, max, title, handler }) => {
  const [count, setCount] = useState(1);

  return (
    <>
      <Input
        label={byWeight ? "Вес" : "Кол-во"}
        type="number"
        step={byWeight ? 0.01 : 1}
        value={count}
        onChange={e => setCount(byWeight ? +e.target.value : Math.floor(+e.target.value))}
        min={byWeight ? 0 : 1}
        max={max}
        disabled={!max}
      />
      <Button
        className="mt-3 w-full"
        onClick={() => {
          handler(id, count);
          setCount(1);
        }}
        disabled={!max}
      >
        {title}
      </Button>
    </>
  );
}
