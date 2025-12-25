import path from "path";
import {loadJsonFile} from "@/lib/helpers/file";
import {FSProductsModel} from "@/lib/model/entities/products";
import {FSCartModel} from "@/lib/model/entities/cart";
import {FSBonusModel} from "@/lib/model/entities/bonus";
import {FSOrderModel} from "@/lib/model/entities/order";
import {MemoryPaymentModel} from "@/lib/model/entities/payment";

const productsPath = path.join(process.cwd(), "src", "data", "products.json");
const bonusCardsPath = path.join(process.cwd(), "src", "data", "bonusCards.json");
const paymentCards = loadJsonFile(path.join(process.cwd(), "src", "data", "paymentCards.json"));
const cartPath = path.join(process.cwd(), "src", "data", "cart.json");
const orderPath = path.join(process.cwd(), "src", "data", "orders.json");

export const productsModel = new FSProductsModel(productsPath);
export const bonusModel = new FSBonusModel(bonusCardsPath);
export const paymentModel = new MemoryPaymentModel(paymentCards);
export const cartModel = new FSCartModel(cartPath);
export const orderModel = new FSOrderModel(orderPath);
