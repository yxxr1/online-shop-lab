"use client"

import React, {useState} from "react";
import {Order as OrderType} from "@/lib/model/types/order";
import {cancelOrder, payOrder} from "@/lib/controllers/order";
import {DataRow} from "@/shared/ui/DataRow";
import {Input} from "@/shared/ui/Input";
import {Button} from "@/shared/ui/Button";
import {Card} from "@/shared/ui/Card";
import {CartItem} from "@/lib/model/types/cart";
import {Product} from "@/lib/model/types/product";

interface Props {
  data: OrderType;
  cartWithInfo: (CartItem & Product)[];
}

export const Order: React.FC<Props> = ({ data: { id, personalData, paymentInfo }, cartWithInfo }) => {
  const [card, setCard] = useState("");

  const payOrderClick = async (orderId: string) => {
    const result = await payOrder(orderId, card);

    if (result?.error) {
      alert(result.error);
    }
  }
  const cancelOrderClick = async (orderId: string) => {
    const result = await cancelOrder(orderId);

    if (result?.error) {
      alert(result.error);
    }
  }

  return (
    <Card key={id} hover className="mb-2">
      <DataRow label="Имя" value={personalData.name} />
      <DataRow label="Адрес" value={personalData.address} />
      <DataRow label="Email" value={personalData.email} />

      <div className="border-b-1 border-gray-300 my-3" />

      <span className="select-none">Товары: </span>
      {cartWithInfo.map(({ productId, quantity, name, price }) => {
        const value = `x${quantity} = ${price * quantity}`

        return <DataRow key={productId} label={name || ""} value={value} />;
      })}

      <div className="border-b-1 border-gray-300 my-3" />

      <DataRow
        label="Стоимость"
        value={cartWithInfo.reduce((sum, { price, quantity }) => sum + price * quantity , 0)}
      />
      {paymentInfo.bonusChange !== 0 && (
        paymentInfo.bonusChange > 0 ? (
          <DataRow label={paymentInfo.isPaid ? "Начислено бонусов" : "Будет начислено бонусов"} value={paymentInfo.bonusChange} />
        ) : (
          <DataRow label="Потрачено бонусов" value={-paymentInfo.bonusChange} />
        )
      )}
      <DataRow label="Сумма" value={paymentInfo.sum + (paymentInfo.isPaid ? " (оплачено)" : "")} />

      <div className="border-b-1 border-gray-300 my-3" />

      {!paymentInfo.isPaid && (
        <>
          <span className="font-bold">Оплата заказа</span>
          <Input
            label="Платежная карта"
            required
            name="paymentCard"
            value={card}
            onChange={(e) => setCard(e.target.value)}
          />
          <Button className="mb-2" onClick={() => payOrderClick(id)}>Оплатить заказ</Button>
        </>
      )}
      <Button onClick={() => cancelOrderClick(id)}>Отменить заказ</Button>
    </Card>
  );
}
