import { provide } from 'inversify-binding-decorators'
import { TYPES } from '../../config/ioc/types'
import { IDBService } from './index'
import { IDB } from '~/models/db.model'
import { jsonClass } from './json/json.service'
import { inject } from 'inversify'
import { IConfig } from '~/config/vars'
import { IGlobalService } from '../globales'

@provide(TYPES.IDBService)
export class DB implements IDBService {
  private typeDB: string = ''

  constructor(
    @inject(TYPES.IConfig)
    private config: IConfig,
    @inject(TYPES.IGlobalService)
    private global: IGlobalService
  ) {
    this.typeDB = this.config.getVars().back.tipoBD
  }
  public lecturaDB(data: IDB): Object {
    const instanciaDB = this.selectToDB(data.type)
    return instanciaDB.getData()
  }

  public searchById(data: IDB): Object {
    const instanciaDB = this.selectToDB(data.type)
    return instanciaDB.getDataById(data.payload)
  }

  public async writeDB(data: IDB): Promise<boolean> {
    const instanciaDB = this.selectToDB(data.type)
    const result: boolean = instanciaDB.writeFile(data.payload)
    return result;
  }

  private selectToDB(type: string): any {
    let instancia
    switch (this.typeDB) {
      case '1':
        console.log('Base de datos JSON')
        instancia = new jsonClass(type, this.global)
        break
      case '2':
        console.log('Base de datos sql')
        break
      case '3':
        console.log('Base de datos mongo')
        break
    }
    return instancia;
  }
}
