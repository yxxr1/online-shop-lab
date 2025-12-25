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

  _addToCart(id: string, productId: string, weightOrCount: number): UserCart | undefined {
    const cart = this.cartModel.getDataById(id);

    if (!cart) {
      const data = {
        id,
        cart: [{ productId, quantity: weightOrCount }]
      };

      return this.cartModel.addData(data);
    }

    const newCart = [...cart.cart];
    const productItemIndex = newCart.findIndex((item) => item.productId === productId);

    if (productItemIndex !== -1) {
      const productItem = newCart[productItemIndex];
      newCart[productItemIndex] = { ...productItem, quantity: numToFixed(productItem.quantity + weightOrCount) }
    } else {
      const newItem = { productId, quantity: weightOrCount };
      newCart.push(newItem);
    }

    return this.cartModel.updateDataById(id, { cart: newCart });
  }

  _removeFromCart(id: string, productId: string, weightOrCount: number): UserCart | undefined {
    const data = this.cartModel.getDataById(id);

    if (!data) {
      return;
    }

    const productItemIndex = data.cart.findIndex((item) => item.productId === productId);

    if (productItemIndex !== -1) {
      const newCart = [...data.cart];
      const productItem = newCart[productItemIndex];

      if (productItem.quantity - weightOrCount <= 0) {
        newCart.splice(productItemIndex, 1);
      } else {
        newCart[productItemIndex] = { ...productItem, quantity: numToFixed(productItem.quantity - weightOrCount) };
      }

      return this.cartModel.updateDataById(id, { cart: newCart });
    }
  }

  addToCart(id: string, productId: string, weightOrCount: number): UserCart | undefined {
    const product = this.productsModel.getDataById(productId);

    if (!product || product.stock < weightOrCount) {
      throw new Error("Продукта нет в наличии");
    }

    const quantity = product.byWeight ? weightOrCount : Math.floor(weightOrCount);
    // транзакция
    this.productsModel.updateDataById(productId, { stock: numToFixed(product.stock - quantity) });
    return this._addToCart(id, productId, quantity);
  }

  removeFromCart(id: string, productId: string, weightOrCount: number): UserCart | undefined {
    const cart = this.cartModel.getDataById(id);
    const cartProduct = (cart?.cart || []).find((item) => item.productId === productId);

    if (!cartProduct) {
      throw new Error("Нет продукта в корзине");
    }

    const product = this.productsModel.getDataById(productId);
    const quantity = product?.byWeight ? weightOrCount : Math.floor(weightOrCount);
    const stockChange = Math.min(cartProduct.quantity, quantity);

    // транзакция
    this.productsModel.updateDataById(productId, { stock: numToFixed((product?.stock || 0) + stockChange) });
    return this._removeFromCart(id, productId, quantity);
  }

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
