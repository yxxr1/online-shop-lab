"use server"

import {getSession} from "@/lib/helpers/session";
import {orderService} from "@/lib/services/order";
import {PersonalData} from "@/lib/model/types/user";
import {redirect} from "next/navigation";
import {refresh} from "next/cache";
import {numToFixed} from "@/lib/helpers/num";

export const createOrder = async (personalData: PersonalData, paymentCard?: string, bonusCard?: string, bonusValue?: number): Promise<{ error: string } | undefined> => {
  if (
    typeof personalData?.name !== "string" || !personalData.name
    || typeof personalData?.address !== "string" || !personalData.address
    || typeof personalData?.email !== "string" || !personalData.email
    || (paymentCard !== undefined && typeof paymentCard !== "string")
    || (bonusCard !== undefined && typeof bonusCard !== "string")
    || (bonusValue !== undefined && typeof bonusValue !== "number")
  ) {
    throw new Error("incorrect args");
  }

  const userSession = await getSession();

  try {
    orderService.createOrder(
      userSession,
      personalData,
      paymentCard,
      bonusCard,
      bonusValue && numToFixed(bonusValue)
    );
  } catch (e) {
    console.log(e)
    return { error: (e as Error).message };
  }

  redirect("/orders");
}

export const payOrder = async (orderId: string, paymentCard: string): Promise<{ error: string } | undefined> => {
  if (typeof orderId !== "string" || typeof paymentCard !== "string") {
    throw new Error("incorrect args");
  }

  try {
    orderService.payOrder(orderId, paymentCard);
    refresh();
  } catch (e) {
    console.log(e)
    return { error: (e as Error).message };
  }
}

export const cancelOrder = async (orderId: string): Promise<{ error: string } | undefined> => {
  if (typeof orderId !== "string") {
    throw new Error("incorrect args");
  }

  const userSession = await getSession();

  try {
    orderService.cancelOrder(userSession, orderId);
    refresh();
  } catch (e) {
    console.log(e)
    return { error: (e as Error).message };
  }
}
