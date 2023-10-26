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
} from 'inversify-express-utils'

import { reporteSchema, ventaSchema } from './venta.model'
import { TYPES } from '../../../config/ioc/types'
import { IVentasService } from '~/services/ventas'

@controller('/ventas')
export class VentasController implements interfaces.Controller {
  constructor(
    @inject(TYPES.IVentasService)
    private ventasService: IVentasService
  ) {}

  @httpPost('/crearVenta')
  public async crearVenta(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() nextFunc: express.NextFunction
  ) {
    const payload = req.body
    // tslint:disable-next-line: no-console
    console.log('Payload', payload)
    const validationResult = joi.validate(payload, ventaSchema)

    if (validationResult.error) {
      // tslint:disable-next-line:no-console
      console.error(
        `POST /v1/ventas/crearVenta - Formato de request invalido: ${validationResult.error}`
      )
      res.status(422).json({ errors: ['invalid_request'] })
      nextFunc()
      return
    }
    try {
      const factura = await this.ventasService.crearVenta(payload)
      const httpResponse: any = { factura }
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
  @httpPost('/reporte')
  public async reporte(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() nextFunc: express.NextFunction
  ) {
    const payload = req.body
    // tslint:disable-next-line: no-console
    console.log('Payload', payload)
    const validationResult = joi.validate(payload, reporteSchema)

    if (validationResult.error) {
      // tslint:disable-next-line:no-console
      console.error(
        `POST /v1/ventas/reporte - Formato de request invalido: ${validationResult.error}`
      )
      res.status(422).json({ errors: ['invalid_request'] })
      nextFunc()
      return
    }
    try {
      const reporte = await this.ventasService.reporte(payload)
      const httpResponse: any = { reporte }
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
}
