import {MemoryStorage} from "@/lib/model/storage/memoryStorage";
import {PaymentCard} from "@/lib/model/types/payment";

export class MemoryPaymentModel extends MemoryStorage<PaymentCard> {}
