import {FSStorage} from "@/lib/model/storage/fsStorage";
import {Product} from "@/lib/model/types/product";

export class FSProductsModel extends FSStorage<Product> {
  // дополняет метод добавления данных генерацией id
  addData(data: Product) {
    const newId = (+this._data[this._data.length - 1].id + 1).toString();
    const newData: Product = {
      ...data,
      id: newId,
    };

    return super.addData(newData);
  }
}
