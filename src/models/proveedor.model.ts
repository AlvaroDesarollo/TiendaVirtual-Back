import { IProducto } from "./producto.model"

export interface IProveedor {
  id: number
  nombre: string
  correo: string
  telefono: number
  productos?: IProducto[]
}
