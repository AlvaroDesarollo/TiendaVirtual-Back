import { ICliente } from '@models/cliente.model'

export interface IClientesServices {
  getClienteByDocumento(
    idCliente: string
  ): Promise<{ nombre: string; correo: string }>

  crearCliente(cliente: ICliente): Promise<boolean>
}
