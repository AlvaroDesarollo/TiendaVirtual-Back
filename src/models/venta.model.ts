export interface IVenta {
  id: string
  totalVenta: number
  fecha: string
  idVentaForProducto: string
  idCliente: string
}

export interface ICrearVenta {
  productos: [{ id: string; cantidadComprada: number }]
  valorVenta: number
  clienteId: string
  fecha: string
}
