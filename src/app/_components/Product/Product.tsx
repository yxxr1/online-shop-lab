"use client"

import React, {useState} from "react";
import {Product as ProductType} from "@/lib/model/types/product";
import {CartButton} from "@/app/_components/CartButton";
import {addToCart} from "@/lib/controllers/cart";
import {DataRow} from "@/shared/ui/DataRow";
import {Card} from "@/shared/ui/Card";

interface Props {
  data: ProductType;
}

export const Product: React.FC<Props> = ({ data }) => {
  const [stateData, setStateData] = useState(data);

  const handler = async (id: string, count: number) => {
    const result = await addToCart(id, count);

    if (result.error) {
      alert(result.error);
    } else if (result.product) {
      setStateData(result.product);
    }
  }

  return (
    <Card hover className="flex flex-col justify-between">
      <div>
        <span className="block font-bold">{stateData.name}</span>
        <div>
          <DataRow label="Цена" value={stateData.price} />
        </div>
        <div>
          <DataRow label={stateData.byWeight ? "Вес" : "Количество"} value={stateData.stock} />
        </div>
      </div>
      <div className="mt-3">
        <CartButton id={stateData.id} byWeight={stateData.byWeight} max={stateData.stock} title="В корзину" handler={handler} />
      </div>
    </Card>
  );
}
