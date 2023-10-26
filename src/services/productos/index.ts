import { IProducto } from '@models/producto.model'

export interface IProductosService {
  getProductos(): Promise<IProducto>
  getProductoById(id: string): Promise<IProducto>
  crearProducto(producto: IProducto): Promise<boolean>
}
