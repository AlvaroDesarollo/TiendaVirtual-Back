export interface IVentaForProducto {
  id: string
  idVenta: string
  productos: [{ id: string; cantidadComprada: number }]
}
