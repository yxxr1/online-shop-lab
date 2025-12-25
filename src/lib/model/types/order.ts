import {CartItem} from "@/lib/model/types/cart";
import {PersonalData} from "@/lib/model/types/user";

interface PaymentInfo {
  isPaid: boolean;
  sum: number;
  paymentCard?: string;
  bonusChange: number;
  bonusCard?: string;
}

export interface Order {
  id: string;
  userId: string;
  personalData: PersonalData;
  paymentInfo: PaymentInfo;
  cart: CartItem[];
}
