import Link from "next/link";
import Image from "next/image";
import Cart from './assets/cart.svg';

const ShopName = 'Магазин';

export const Header = () => {
  return (
    <header className="bg-emerald-900 flex justify-between items-center p-3">
      <Link href="/">
        <h1 className="text-3xl text-white">{ShopName}</h1>
      </Link>
      <nav>
        <Link className="text-white hover:underline mr-4" href="/orders">
          Заказы
        </Link>
        <Link className="text-white hover:underline" href="/cart">
          <Image className="inline mr-1" src={Cart} alt="cart" height={22} />
          Корзина
        </Link>
      </nav>
    </header>
  );
}
