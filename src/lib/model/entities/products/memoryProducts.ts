import {MemoryStorage} from "@/lib/model/storage/memoryStorage";
import {Product} from "@/lib/model/types/product";

export class MemoryProductsModel extends MemoryStorage<Product> {
  addData(data: Product) {
    const newId = (+this._data[this._data.length - 1].id + 1).toString();
    const newData: Product = {
      ...data,
      id: newId,
    };

    return super.addData(newData);
  }
}
