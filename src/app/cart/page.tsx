import {bonusModel, cartModel, productsModel} from "@/lib/model";
import {getSessionIfExists} from "@/lib/helpers/session";
import {CartProduct} from "@/app/_components/CartProduct";
import {cartService} from "@/lib/services/cart";
import {OrderForm} from "@/app/_components/OrderForm";
import {Card} from "@/shared/ui/Card";

export default async function Cart() {
  const userSession = await getSessionIfExists();
  const cart = (userSession && cartModel.getDataById(userSession)?.cart) || [];

  const getBonusValue = async (bonusCard: string): Promise<number | undefined> => {
    "use server"
    return bonusModel.getDataById(bonusCard)?.value;
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <Card className="grid gap-2 h-fit min-h-[50px]">
        {!!cart?.length ? cart.map(({ productId, quantity }) => {
          const product = productsModel.getDataById(productId);

          return product && <CartProduct key={productId} data={product} quantity={quantity} />;
        }) : "Корзина пуста"}
      </Card>
      <Card className="h-fit min-h-[50px]">
        {!!cart?.length && (
          <OrderForm sum={(userSession && cartService.getCartValue(userSession)) || 0} getBonusValue={getBonusValue} />
        )}
      </Card>
    </div>
  );
}
