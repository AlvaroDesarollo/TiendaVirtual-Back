import { provide } from 'inversify-binding-decorators'
import * as fs from 'fs'
import * as path from 'path'

import productosSource from 'C:/Ultrapark/DB/JSon/db/productos.json'
import categoriasSource from 'C:/Ultrapark/DB/JSon/db/categorias.json'
import clientesSource from 'C:/Ultrapark/DB/JSon/db/clientes.json'
import proveedoresSource from 'C:/Ultrapark/DB/JSon/db/proveedores.json'
import ventasSource from 'C:/Ultrapark/DB/JSon/db/ventas.json'
import ventaForProductoSource from 'C:/Ultrapark/DB/JSon/db/ventaForProducto.json'

import { TYPES } from '../../../config/ioc/types'
import { IJson } from './json.model'
import { inject } from 'inversify'
import { IGlobalService } from '~/services/globales'

@provide(TYPES.IJSONService)
export class jsonClass {
  private archivos: IJson = {
    categorias: categoriasSource,
    clientes: clientesSource,
    productos: productosSource,
    proveedores: proveedoresSource,
    ventas: ventasSource,
    ventaForProducto: ventaForProductoSource as any,
  }
  private archivoConsultar: string = ''

  constructor(
    archivoConsultar: string,
    @inject(TYPES.IGlobalService) private global: IGlobalService
  ) {
    this.archivoConsultar = archivoConsultar
  }

  public async getData(): Promise<object> {
    let datos = this.archivos[this.archivoConsultar as keyof IJson]
    return this.formatData(datos)
  }

  public getDataById(payload: any): object {
    let datos = this.archivos[this.archivoConsultar as keyof IJson]
    datos = this.formatData(datos)
    console.log(this.archivoConsultar, ' -- Archivo consultado')
    const dato = datos.filter((dato: any) => dato.id == payload.id)

    return dato
  }

  public async writeFile(payload: any): Promise<boolean> {
    let isNuevo: boolean = true
    let datos = this.archivos[this.archivoConsultar as keyof IJson]
    datos = this.formatData(datos)
    datos.map((dato: any) => {
      if (!dato.id) {
        return
      }
      if (dato.id === payload.id) {
        isNuevo = false
        dato = payload
        return dato
      }
    })

    console.log(isNuevo, ': se escribe en bd')
    if (isNuevo) {
      datos.push(payload)
    }
    try {
      const ruta = path.join(
        'C:/Ultrapark/DB/JSon',
        'db',
        `${this.archivoConsultar}.json`
      )
      await fs.writeFileSync(ruta, JSON.stringify(datos))
      return true
    } catch (error) {
      console.error('Error al escribir archivo, ', error)
      return false
    }
  }

  private formatData(data: any): Array<any> {
    if (typeof data === 'string') JSON.parse(data)
    return data
  }
}
