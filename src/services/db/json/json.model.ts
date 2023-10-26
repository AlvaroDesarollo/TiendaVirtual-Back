import { IVenta } from '@models/venta.model'
import { IProducto } from '@models/producto.model'
import { IVentaForProducto } from '~/models/ventaForProducto.model'

export interface IJson {
  categorias: any
  clientes: any
  productos: IProducto[]
  proveedores: any
  ventas: IVenta[]
  ventaForProducto: IVentaForProducto[]
}
