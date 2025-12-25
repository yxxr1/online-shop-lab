"use client"

import React from "react";
import {Product} from "@/lib/model/types/product";
import {removeFromCart} from "@/lib/controllers/cart";
import {CartButton} from "@/app/_components/CartButton";
import {DataRow} from "@/shared/ui/DataRow";
import {Card} from "@/shared/ui/Card";

interface Props {
  data: Product;
  quantity: number;
}

export const CartProduct: React.FC<Props> = ({ data, quantity }) => {
  const handler = async (id: string, count: number) => {
    const result = await removeFromCart(id, count);
    result && result.error && alert(result.error);
  }

  return (
    <Card hover className="flex justify-between">
      <div>
        <span className="block font-bold">{data.name}</span>
        <div>
          <DataRow label="Цена" value={data.price} />
        </div>
        <div>
          <DataRow label={data.byWeight ? "Вес" : "Количество"} value={quantity} />
        </div>
      </div>
      <div className="h-[85px]">
        <CartButton id={data.id} byWeight={data.byWeight} max={quantity} title="Удалить из корзины" handler={handler} />
      </div>
    </Card>
  );
}
