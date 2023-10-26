import { provide } from 'inversify-binding-decorators'
import { TYPES } from '../../config/ioc/types'

import { DB } from '../db/db.service'
import { inject } from 'inversify'
import { IConfig } from '~/config/vars'
import { IGlobalService } from '../globales'
import { IClientesServices } from '.'
import { ICliente } from '~/models/cliente.model'
import { IDBService } from '../db'

@provide(TYPES.IClientesServices)
export class Clientes implements IClientesServices {
  constructor(
    @inject(TYPES.IConfig)
    private config: IConfig,
    @inject(TYPES.IGlobalService)
    private global: IGlobalService,
    @inject(TYPES.IDBService)
    private db: IDBService
  ) {}
  public async getClienteByDocumento(
    idCliente: string
  ): Promise<{ nombre: string; correo: string }> {
    let cliente: ICliente[] = (await this.db.searchById({
      type: 'clientes',
      payload: { id: idCliente },
    })) as any
    if (cliente.length === 0) {
      cliente = [
        {
          nombre: '',
          correo: '',
          id: '',
          telefono: '',
        },
      ]
    }
    return { nombre: cliente[0].nombre, correo: cliente[0].correo }
  }

  public async crearCliente(cliente: ICliente): Promise<boolean> {
    try {
      return await this.db.writeDB({ type: 'clientes', payload: cliente })
    } catch (err) {
      console.log('Error al crear cliente', err)
      throw 'Error creando cliente'
    }
  }
}
