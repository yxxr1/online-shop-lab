"use server"

import { refresh } from 'next/cache'
import {getSession} from "@/lib/helpers/session";
import {cartService} from "@/lib/services/cart";
import {productsModel} from "@/lib/model";
import {Product} from "@/lib/model/types/product";
import {numToFixed} from "@/lib/helpers/num";

type AddResult = {
  product?: Product;
};

export const addToCart = async (productId: string, weightOrCount: number): Promise<{ error?: string } & (AddResult)> => {
  if (typeof productId !== "string" || typeof weightOrCount !== "number") {
    throw new Error("incorrect args");
  }

  const userSession = await getSession();

  try {
    cartService.addToCart(userSession, productId, numToFixed(weightOrCount));

    return {
      product: productsModel.getDataById(productId),
    };
  } catch (e) {
    console.log(e)
    return { error: (e as Error).message }
  }
}

export const removeFromCart = async (productId: string, weightOrCount: number): Promise<{ error: string } | undefined> => {
  if (typeof productId !== "string" || typeof weightOrCount !== "number") {
    throw new Error("incorrect args");
  }

  const userSession = await getSession();

  try {
    cartService.removeFromCart(userSession, productId, numToFixed(weightOrCount));

    refresh();
  } catch (e) {
    console.log(e)
    return { error: (e as Error).message }
  }
}
