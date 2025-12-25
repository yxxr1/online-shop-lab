import React from "react";
import {orderModel, productsModel} from "@/lib/model";
import {getSessionIfExists} from "@/lib/helpers/session";
import {Order} from "@/app/_components/Order";

export default async function Orders() {
  const userSession = await getSessionIfExists();
  const userOrders = orderModel.getAllData().filter(({ userId }) => userId === userSession);

  return (
    userOrders.length ? userOrders.map((order) => {
      const cart = order.cart.map((item) => ({
        ...item,
        ...productsModel.getDataById(item.productId)!,
      }));

      return <Order key={order.id} data={order} cartWithInfo={cart} />;
    }) : "Нет заказов"
  );
}
