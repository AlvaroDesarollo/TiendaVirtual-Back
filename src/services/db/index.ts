import { IDB } from "@models/db.model";

export interface IDBService {
    lecturaDB(data:IDB): Object,
    searchById(data:IDB): Object,
    writeDB(data:IDB): Promise<boolean>,
  }