import * as express from 'express'
import joi from 'joi'
import { inject } from 'inversify'
import {
  controller,
  httpGet,
  interfaces,
  next,
  response,
  request,
  httpPost,
} from 'inversify-express-utils'

import { TYPES } from '../../../config/ioc/types'
import { categoriaSchema } from './categoria.model'
import { ICategoriasService } from '~/services/categorias'
// import { productoSchema } from './producto.model'

@controller('/categoria')
export class CategoriasController implements interfaces.Controller {
  constructor(
    @inject(TYPES.ICategoriasService)
    private productosService: ICategoriasService
  ) {}

  @httpGet('/')
  public async getCategorias(
    @response() res: express.Response,
    @next() nextFunc: express.NextFunction
  ) {
    try {
      const result = await this.productosService.getCategoria()
      const httpResponse: any = result
      res.json(httpResponse)
      nextFunc()
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.error(`Get /v1/Productos - Error: ${JSON.stringify(err)}`)
      res.status(500).json({ errors: ['internal_server_error'] })
      nextFunc()
      return
    }
  }

  @httpPost('/crearCategoria')
  public async crearCategoria(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() nextFunc: express.NextFunction
  ) {
    try {
      const payload = req.body
      // tslint:disable-next-line: no-console
      console.log('Payload', payload)
      const validationResult = joi.validate(payload, categoriaSchema)

      if (validationResult.error) {
        // tslint:disable-next-line:no-console
        console.error(
          `POST /v1/builder - Formato de request invalido: ${validationResult.error}`
        )
        res.status(422).json({ errors: ['invalid_request'] })
        nextFunc()
        return
      }
      const result = await this.productosService.crearCategoria(
        payload.nombreCategoria
      )
      const httpResponse: any = result
      res.json(httpResponse)
      nextFunc()
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.error(`Get /v1/Productos - Error: ${JSON.stringify(err)}`)
      res.status(500).json({ errors: ['internal_server_error'] })
      nextFunc()
      return
    }
  }
}
