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

import { IProductosService } from '@services/productos'

import { TYPES } from '../../../config/ioc/types'
import { productoSchema } from './producto.model'



@controller('/products')
export class ProductosController implements interfaces.Controller {
  constructor(
    @inject(TYPES.IProductosService)
    private productosService: IProductosService
  ) {}
  @httpGet('/')
  public async getProductos(
    @response() res: express.Response,
    @next() nextFunc: express.NextFunction
  ) {
    try {
      const result = await this.productosService.getProductos()
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
  @httpGet('/:id')
  public async getProductoById(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() nextFunc: express.NextFunction
  ) {
    try {
      const id = req.params.id
      const result = await this.productosService.getProductoById(id)
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

  @httpPost('/crearProducto')
  public async crearProducto(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() nextFunc: express.NextFunction
  ) {
    try {
      const payload = req.body
      // tslint:disable-next-line: no-console
      console.log('Payload', payload)
      const validationResult = joi.validate(payload, productoSchema)

      if (validationResult.error) {
        // tslint:disable-next-line:no-console
        console.error(
          `POST /v1/builder - Formato de request invalido: ${validationResult.error}`
        )
        res.status(422).json({ errors: ['invalid_request'] })
        nextFunc()
        return
      }
      const id = req.params.id
      const result = await this.productosService.crearProducto(payload)
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
