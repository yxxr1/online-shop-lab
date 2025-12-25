import {paymentModel} from "@/lib/model";
import {BaseStorage} from "@/lib/model/storage/baseStorage";
import {PaymentCard} from "@/lib/model/types/payment";
import {numToFixed} from "@/lib/helpers/num";

class PaymentService {
  paymentModel: BaseStorage<PaymentCard>;

  constructor(paymentModel: BaseStorage<PaymentCard>) {
    this.paymentModel = paymentModel;
  }

  paySum(card: string, sum: number, recipientCard: string): boolean {
    const payment = this.paymentModel.getDataById(card);
    const recipientPayment = this.paymentModel.getDataById(recipientCard);

    if (!payment || !recipientPayment) {
      throw new Error("Несуществующая карта");
    }

    if (payment.value < sum) {
      throw new Error("Недостаточно средств");
    }

    // транзакция
    return !!(
      this.paymentModel.updateDataById(card, { value: numToFixed(payment.value - sum) })
      && this.paymentModel.updateDataById(recipientCard, { value: numToFixed(recipientPayment.value + sum) })
    );
  }

  refundSum(card: string, sum: number, sourceCard: string) {
    return this.paySum(sourceCard, sum, card);
  }
}

export const paymentService = new PaymentService(paymentModel);
