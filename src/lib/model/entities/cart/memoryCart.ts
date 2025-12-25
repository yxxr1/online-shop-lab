import {MemoryStorage} from "@/lib/model/storage/memoryStorage";
import {UserCart} from "@/lib/model/types/cart";


export class MemoryCartModel extends MemoryStorage<UserCart> {}
