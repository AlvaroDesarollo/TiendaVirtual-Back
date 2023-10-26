import { ICrearVenta } from '@models/venta.model'

export interface IVentasService {
  crearVenta(payload: ICrearVenta): Promise<string>
  reporte(payload: {
    tipo: 'total' | 'totalProducto' | 'producto'
    producto: string
  }): Promise<string>
}
