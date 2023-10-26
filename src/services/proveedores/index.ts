import { IProveedor } from '@models/proveedor.model'

export interface IProveedorService {
  getProveedor(doc: string): Promise<IProveedor>
  crearProveedor(proveedor: IProveedor): Promise<boolean>
}
