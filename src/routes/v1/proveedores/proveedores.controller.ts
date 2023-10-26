import * as express from 'express'
import { inject } from 'inversify'
import joi from 'joi'
import {
  controller,
  httpPost,
  interfaces,
  next,
  response,
  request,
  httpGet,
} from 'inversify-express-utils'

import { TYPES } from '../../../config/ioc/types'
import { IProveedorService } from '~/services/proveedores'
import { proveedorSchema } from './proveedor.model'

@controller('/proveedor')
export class ProveedoresController implements interfaces.Controller {
  constructor(
    @inject(TYPES.IProveedorService)
    private proveedorService: IProveedorService
  ) {}

  @httpPost('/crearProveedor')
  public async crearProveedor(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() nextFunc: express.NextFunction
  ) {
    const payload = req.body
    // tslint:disable-next-line: no-console
    console.log('Payload', payload)
    const validationResult = joi.validate(payload, proveedorSchema)

    if (validationResult.error) {
      // tslint:disable-next-line:no-console
      console.error(
        `POST /v1/proveedor/crearProveedor - Formato de request invalido: ${validationResult.error}`
      )
      res.status(422).json({ errors: ['invalid_request'] })
      nextFunc()
      return
    }
    try {
      const result = await this.proveedorService.crearProveedor(payload)
      const httpResponse: any = { result }
      res.json(httpResponse)
      nextFunc()
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.error(
        `Post /v1/ventas/crearVenta - Error: ${JSON.stringify(err)}`
      )
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
      const result: any = await this.proveedorService.getProveedor(id)
      let httpResponse: any = result[0]
      console.log(httpResponse)
      if (!httpResponse) {
        httpResponse = {
          nombre: '',
          correo: '',
        }
      }
      res.json(httpResponse)
      nextFunc()
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.error(`Get /v1/Proveedor - Error: ${JSON.stringify(err)}`)
      res.status(500).json({ errors: ['internal_server_error'] })
      nextFunc()
      return
    }
  }
}
