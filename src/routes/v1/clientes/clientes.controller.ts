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
import { IClientesServices } from '~/services/clientes'
import { clienteSchema } from './cliente.model'



@controller('/cliente')
export class ClientesController implements interfaces.Controller {
  constructor(
    @inject(TYPES.IClientesServices)
    private clientesServices: IClientesServices
  ) {}
  @httpGet('/:id')
  public async getProductoById(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() nextFunc: express.NextFunction
  ) {
    try {
      const id = req.params.id
      const result = await this.clientesServices.getClienteByDocumento(id)
      const httpResponse: any = result
      res.json(httpResponse)
      nextFunc()
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.error(`Get /v1/cliente - Error: ${JSON.stringify(err)}`)
      res.status(500).json({ errors: ['internal_server_error'] })
      nextFunc()
      return
    }
  }

  @httpPost('/crearCliente')
  public async crearVenta(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() nextFunc: express.NextFunction
  ) {
    const payload = req.body
    // tslint:disable-next-line: no-console
    console.log('Payload', payload)
    const validationResult = joi.validate(payload, clienteSchema)

    if (validationResult.error) {
      // tslint:disable-next-line:no-console
      console.error(
        `POST /v1/builder - Formato de request invalido: ${validationResult.error}`
      )
      res.status(422).json({ errors: ['invalid_request'] })
      nextFunc()
      return
    }
    try {
      const cliente = await this.clientesServices.crearCliente(payload)
      const httpResponse: any = { cliente }
      res.json(httpResponse)
      // nextFunc()
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
