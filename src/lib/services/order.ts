import {v4 as uuidv4} from "uuid";
import {bonusModel, cartModel, orderModel, productsModel} from "@/lib/model";
import {BaseStorage} from "@/lib/model/storage/baseStorage";
import {Order} from "@/lib/model/types/order";
import {UserCart} from "@/lib/model/types/cart";
import {BonusCard} from "@/lib/model/types/bonus";
import {Product} from "@/lib/model/types/product";
import {PersonalData} from "@/lib/model/types/user";
import {cartService} from "@/lib/services/cart";
import {paymentService} from "@/lib/services/payment";
import {numToFixed} from "@/lib/helpers/num";

const ACCRUE_BONUS_PERCENT = 0.05;
const SHOP_CARD = "7777777777777777";

class OrderService {
  orderModel: BaseStorage<Order>;
  cartModel: BaseStorage<UserCart>;
  bonusModel: BaseStorage<BonusCard>;
  productsModel: BaseStorage<Product>;

  constructor(orderModel: BaseStorage<Order>, cartModel: BaseStorage<UserCart>, bonusModel: BaseStorage<BonusCard>, productsModel: BaseStorage<Product>) {
    this.orderModel = orderModel;
    this.cartModel = cartModel;
    this.bonusModel = bonusModel;
    this.productsModel = productsModel;
  }

  _calcBonus(cartSum: number, bonusCard?: string, bonusValue?: number) {
    if (!bonusCard) {
      return { bonusToPay: 0, bonusChange: 0, newBonusValue: 0 };
    }

    const bonus = this.bonusModel.getDataById(bonusCard);

    if (!bonus) {
      throw new Error('Несуществующая бонусная карта');
    }

    // чтобы не потратить больше бонусов чем стоимость заказа
    const bonusToPay = Math.min(bonusValue || 0, cartSum);

    if (bonus.value < bonusToPay) {
      throw new Error('Недостаточно бонусов на карте');
    }

    // списание либо начисление бонусов
    const bonusChange = bonusToPay > 0 ? -bonusToPay : Math.floor(cartSum * ACCRUE_BONUS_PERCENT);

    return { bonusToPay, bonusChange, newBonusValue: numToFixed(bonus.value + bonusChange) };
  }

  createOrder(userId: string, personalData: PersonalData, paymentCard?: string, bonusCard?: string, bonusValue?: number): Order | undefined {
    const cart = this.cartModel.getDataById(userId)?.cart;
    const cartSum = cartService.getCartValue(userId);

    if (!cart?.length || cartSum === undefined) {
      throw new Error("Корзина пуста");
    }

    if (paymentCard === SHOP_CARD) {
      throw new Error("Платежная карта не доступна");
    }

    const { bonusToPay, bonusChange, newBonusValue } = this._calcBonus(cartSum, bonusCard, bonusValue);
    // сумма заказа минус сумма бонусов
    const sumToPay = numToFixed(cartSum - bonusToPay);

    // транзакция
    if (sumToPay && paymentCard) paymentService.paySum(paymentCard, sumToPay, SHOP_CARD);
    const isPaid = !sumToPay || !!paymentCard;
    // проверка что бонусы не начислятся если заказ не оплачен
    const shouldBonusChange = isPaid || bonusChange < 0;
    if (bonusCard && shouldBonusChange) this.bonusModel.updateDataById(bonusCard, { value: newBonusValue });
    this.cartModel.deleteDataById(userId);
    return this.orderModel.addData({
      id: uuidv4(),
      userId,
      personalData,
      cart,
      paymentInfo: {
        sum: sumToPay,
        isPaid,
        paymentCard,
        bonusChange,
        bonusCard: bonusChange !== 0 ? bonusCard : undefined
      },
    });
  }

  // оплата созданного заказа
  payOrder(orderId: string, paymentCard: string) {
    const order = this.orderModel.getDataById(orderId);

    if (order) {
      const { paymentInfo: { isPaid, sum, bonusChange, bonusCard } } = order;

      if (isPaid) {
        throw new Error("Заказ уже оплачен");
      }

      const isSuccess = paymentService.paySum(paymentCard, sum, SHOP_CARD);

      if (!isSuccess) {
        throw new Error("Ошибка платежа");
      }

      // заказ становится оплаченным и нужно начислить бонусы
      const shouldBonusChange = bonusChange > 0;
      const bonus = shouldBonusChange && bonusCard && this.bonusModel.getDataById(bonusCard);

      // транзакция
      if (bonus) this.bonusModel.updateDataById(bonus.id, { value: bonus.value + bonusChange });
      return this.orderModel.updateDataById(orderId, { paymentInfo: { ...order.paymentInfo, isPaid: true, paymentCard } });
    }

    throw new Error("Несуществующий заказ");
  }

  cancelOrder(userId: string, orderId: string): Order | undefined {
    const order = this.orderModel.getDataById(orderId);

    if (order && order.userId === userId) {
      const { paymentInfo } = order;

      // транзакция
      const bonusCard = paymentInfo.bonusCard && this.bonusModel.getDataById(paymentInfo.bonusCard);
      let spentBonuses = 0;

      // проверка был ли изменен баланс бонусов при оформлении заказа
      const wasBonusChanged = paymentInfo.isPaid || paymentInfo.bonusChange < 0;
      if (bonusCard && wasBonusChanged) {
        let value = bonusCard.value - paymentInfo.bonusChange;

        // проверка если начисленные бонусы уже были потрачены
        if (value < 0) {
          // потраченные бонусы будут вычтены из суммы возврата
          spentBonuses = -value;
          value = 0;
        }

        this.bonusModel.updateDataById(bonusCard.id, { value });
      }
      // возврат товаров из заказа в наличие
      order.cart.forEach((item) => {
        const product = this.productsModel.getDataById(item.productId);
        product && this.productsModel.updateDataById(item.productId, { stock: product.stock + item.quantity });
      });
      const deletedOrder = this.orderModel.deleteDataById(orderId);

      // после успешного удаления заказа возвращается оплата
      if (paymentInfo.isPaid && paymentInfo.paymentCard) {
        paymentService.refundSum(paymentInfo.paymentCard, paymentInfo.sum - spentBonuses, SHOP_CARD);
      }

      return deletedOrder;
    }

    throw new Error("Несуществующий заказ");
  }
}

export const orderService = new OrderService(orderModel, cartModel, bonusModel, productsModel);
