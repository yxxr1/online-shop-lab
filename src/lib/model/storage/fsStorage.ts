import {MemoryStorage} from "@/lib/model/storage/memoryStorage";
import {loadJsonFile, writeFileSyncDebounced} from "@/lib/helpers/file";
import {BaseData} from "@/lib/model/storage/baseStorage";

// дополняет MemoryStorage синхронизацией данных в файл
export class FSStorage<T extends BaseData> extends MemoryStorage<T> {
  _filePath: string;
  _writeFileDebounced: ReturnType<typeof writeFileSyncDebounced>;

  constructor(filePath: string) {
    super(loadJsonFile(filePath));
    this._filePath = filePath;
    this._writeFileDebounced = writeFileSyncDebounced(filePath);
  }

  _writeFile() {
    this._writeFileDebounced(this._data);
  }

  addData(data: T) {
    const result = super.addData(data);

    this._writeFile();

    return result;
  }

  updateDataById(updateId: string, updateData: Partial<Omit<T, "id">> ) {
    const result = super.updateDataById(updateId, updateData);

    this._writeFile();

    return result;
  }

  deleteDataById(deleteId: string) {
    const result = super.deleteDataById(deleteId);

    this._writeFile();

    return result;
  }
}
