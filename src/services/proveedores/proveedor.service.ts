import { provide } from 'inversify-binding-decorators'
import { inject } from 'inversify'

import { IConfig } from '@config/vars'
import { TYPES } from '../../config/ioc/types'

import { IProveedorService } from './index'
import { IGlobalService } from '../globales'
import { IDBService } from '../db'
import { ICategoriasService } from '../categorias'
import { IProveedor } from '~/models/proveedor.model'

@provide(TYPES.IProveedorService)
export class Proveedores implements IProveedorService {
  constructor(
    @inject(TYPES.IConfig)
    private config: IConfig,
    @inject(TYPES.IGlobalService)
    private global: IGlobalService,
    @inject(TYPES.IDBService)
    private db: IDBService,
    @inject(TYPES.ICategoriasService)
    private categoria: ICategoriasService
  ) {}
  public async getProveedor(doc: string): Promise<IProveedor> {
    const proveedor: any = await this.db.searchById({
      type: 'proveedores',
      payload: { id: doc },
    })

    return proveedor
  }
  public async crearProveedor(proveedor: IProveedor): Promise<boolean> {
    return await this.db.writeDB({
      type: 'proveedores',
      payload: proveedor,
    })
  }
}
