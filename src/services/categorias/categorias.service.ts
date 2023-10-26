import { provide } from 'inversify-binding-decorators'
import { TYPES } from '../../config/ioc/types'
import { ICategoriasService } from './index'
import { inject } from 'inversify'
import { IConfig } from '~/config/vars'
import { IGlobalService } from '../globales'
import { IDBService } from '../db'
import { ICategoria } from '~/models/categoria.model'

@provide(TYPES.ICategoriasService)
export class Categorias implements ICategoriasService {
  private categoria: ICategoria | undefined
  constructor(
    @inject(TYPES.IConfig)
    private config: IConfig,
    @inject(TYPES.IGlobalService)
    private global: IGlobalService,
    @inject(TYPES.IDBService)
    private db: IDBService
  ) {}

  public async getCategoria(): Promise<ICategoria> {
    const categorias: any = await this.db.lecturaDB({
      type: 'categorias',
      payload: '',
    })
    return categorias;
  }

  public async crearCategoria(nombreCategoria: string): Promise<boolean> {
    const idCategoria = this.crearConsecutivo()

    this.categoria = {
      id: idCategoria,
      nombreCategoria,
    }
    try {
      await this.db.writeDB({
        type: 'categorias',
        payload: this.categoria,
      })
      return true
    } catch (err) {
      throw new Error('Error creando el producto')
    }
  }

  public async getCategoriaById(idCategoria: string): Promise<ICategoria> {
    const categoria: any = await this.db.searchById({
      type: 'categorias',
      payload: { id: idCategoria },
    })

    return categoria
  }

  private crearConsecutivo(): string {
    return this.global.crearUUID()
  }
}
