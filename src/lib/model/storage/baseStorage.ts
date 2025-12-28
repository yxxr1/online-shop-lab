export interface BaseData {
  id: string;
}

// абстракция хранилища
export abstract class BaseStorage<T extends BaseData> {
  abstract getAllData(): T[];
  abstract getDataById(searchId: BaseData['id']): T | undefined;
  abstract addData(data: T): T;
  // находит запись с переданным id, обновляет переданные поля
  abstract updateDataById(updateId: BaseData["id"], updateData: Partial<Omit<T, "id">>): T | undefined;
  abstract deleteDataById(deleteId: BaseData["id"]): T | undefined;
}
