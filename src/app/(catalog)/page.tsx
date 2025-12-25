import { productsModel } from "@/lib/model";
import {Product} from "@/app/_components/Product";

export default function Catalog() {
  return (
    <div className="grid grid-cols-5 gap-2 row-10">
      {productsModel.getAllData().map((product) => <Product key={product.id} data={product} />)}
    </div>
  );
}
