import { ICategoria } from '@models/categoria.model'

export interface ICategoriasService {
  getCategoria(): Promise<ICategoria>
  crearCategoria(nombreCategoria: string): Promise<boolean>
  getCategoriaById(idCategoria:string): Promise<ICategoria>
}
