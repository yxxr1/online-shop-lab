import {UserCart} from "@/lib/model/types/cart";
import {cartModel, productsModel} from "@/lib/model";
import {BaseStorage} from "@/lib/model/storage/baseStorage";
import {Product} from "@/lib/model/types/product";
import {numToFixed} from "@/lib/helpers/num";

class CartService {
  cartModel: BaseStorage<UserCart>;
  productsModel: BaseStorage<Product>;

  constructor(cartModel: BaseStorage<UserCart>, productsModel: BaseStorage<Product>) {
    this.cartModel = cartModel;
    this.productsModel = productsModel;
  }

  _addToCart(cartId: string, productId: string, weightOrCount: number): UserCart | undefined {
    const cart = this.cartModel.getDataById(cartId);

    if (!cart) {
      // создание корзины для пользователя
      const data = {
        id: cartId,
        cart: [{ productId, quantity: weightOrCount }]
      };

      return this.cartModel.addData(data);
    }

    const newCart = [...cart.cart];
    const productItemIndex = newCart.findIndex((item) => item.productId === productId);

    if (productItemIndex !== -1) {
      // увеличение количества продукта в корзине
      const productItem = newCart[productItemIndex];
      newCart[productItemIndex] = { ...productItem, quantity: numToFixed(productItem.quantity + weightOrCount) }
    } else {
      // добавление продукта в корзину
      const newItem = { productId, quantity: weightOrCount };
      newCart.push(newItem);
    }

    return this.cartModel.updateDataById(cartId, { cart: newCart });
  }

  _removeFromCart(cartId: string, productId: string, weightOrCount: number): UserCart | undefined {
    const data = this.cartModel.getDataById(cartId);

    if (!data) {
      return;
    }

    const productItemIndex = data.cart.findIndex((item) => item.productId === productId);

    // если удаляемый продукт есть в корзине
    if (productItemIndex !== -1) {
      const newCart = [...data.cart];
      const productItem = newCart[productItemIndex];

      if (productItem.quantity - weightOrCount <= 0) {
        // убрать продукт из корзины
        newCart.splice(productItemIndex, 1);
      } else {
        // уменьшить количество в корзине
        newCart[productItemIndex] = { ...productItem, quantity: numToFixed(productItem.quantity - weightOrCount) };
      }

      return this.cartModel.updateDataById(cartId, { cart: newCart });
    }
  }

  addToCart(cartId: string, productId: string, weightOrCount: number): UserCart | undefined {
    const product = this.productsModel.getDataById(productId);

    if (!product || product.stock < weightOrCount) {
      throw new Error("Продукта нет в наличии");
    }

    const quantity = product.byWeight ? weightOrCount : Math.floor(weightOrCount);
    // транзакция
    this.productsModel.updateDataById(productId, { stock: numToFixed(product.stock - quantity) });
    return this._addToCart(cartId, productId, quantity);
  }

  removeFromCart(cartId: string, productId: string, weightOrCount: number): UserCart | undefined {
    const cart = this.cartModel.getDataById(cartId);
    const cartProduct = (cart?.cart || []).find((item) => item.productId === productId);

    if (!cartProduct) {
      throw new Error("Нет продукта в корзине");
    }

    const product = this.productsModel.getDataById(productId);
    const quantity = product?.byWeight ? weightOrCount : Math.floor(weightOrCount);
    // обработка ситуации если в корзине меньше чем нужно убрать
    const stockChange = Math.min(cartProduct.quantity, quantity);

    // транзакция
    this.productsModel.updateDataById(productId, { stock: numToFixed((product?.stock || 0) + stockChange) });
    return this._removeFromCart(cartId, productId, quantity);
  }

  // считает стоимость всех товаров в корзине
  getCartValue(cartId: string): number | undefined {
    const cart = this.cartModel.getDataById(cartId);

    if (cart) {
      return cart.cart.reduce((acc, item) => {
        const itemSum = (this.productsModel.getDataById(item.productId)?.price || 0) * item.quantity;
        return numToFixed(acc + itemSum);
      }, 0);
    }
  }
}

export const cartService = new CartService(cartModel, productsModel);
