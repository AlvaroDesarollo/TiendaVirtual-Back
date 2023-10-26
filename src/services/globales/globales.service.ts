import { provide } from 'inversify-binding-decorators'
import { inject } from 'inversify'
import { v4 as uuid } from 'uuid'

import { TYPES } from '../../config/ioc/types'
import { IConfig } from '../../config/vars'
import { IGlobalService } from '.'

@provide(TYPES.IGlobalService)
export class Global implements IGlobalService {
  constructor(
    @inject(TYPES.IConfig)
    private config: IConfig
  ) {}

  public crearUUID(): string {
    return uuid()
  }
}
