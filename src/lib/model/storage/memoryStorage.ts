import {BaseData, BaseStorage} from "@/lib/model/storage/baseStorage";

export abstract class MemoryStorage<T extends BaseData> extends BaseStorage<T> {
  _data: T[];

  constructor(initialData?: T[]) {
    super();

    this._data = initialData ?? [];
  }

  getAllData(): T[] {
    return this._data;
  }
  getDataById(searchId: string): T | undefined {
    return this._data.find(({ id }) => id === searchId);
  }
  addData(data: T): T {
    this._data.push(data);

    return data;
  }
  // находит запись с переданным id, обновляет переданные поля
  updateDataById(updateId: string, updateData: Partial<Omit<T, "id">>): T | undefined {
    const index = this._data.findIndex(({ id }) => updateId === id);

    if (index === -1) {
      return;
    }

    const data = this._data[index];
    const newData = {
      ...data,
      ...updateData
    };

    this._data[index] = newData;

    return newData;
  }
  deleteDataById(deleteId: string): T | undefined {
    const index = this._data.findIndex(({ id }) => deleteId === id);

    if (index !== -1) {
      return this._data.splice(index, 1)[0];
    }
  }
}
