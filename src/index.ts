// tslint:disable-next-line: no-var-requires
require('module-alias/register')
import * as log4js from 'log4js'
import dotenv = require('dotenv')
if (process.env.NODE_ENV !== 'production') {
  dotenv.load()
}
import 'reflect-metadata'

import { ConfigService } from './config/vars/configService'
const config = new ConfigService()
const configErr = config.load()
if (configErr) throw new Error(configErr)

import * as bodyParser from 'body-parser'
import cors from 'cors'
import * as express from 'express'
import helmet from 'helmet'
import { InversifyExpressServer } from 'inversify-express-utils'
import { container } from './config/ioc/inversify.config'

// import { Container } from 'inversify'
import { TYPES } from './config/ioc/types'

const httpPort = config.getVars().server.port
const httpRootPath = config.getVars().server.rootPath
// tslint:disable-next-line: no-console
console.log('Api iniciando...')

import './config/ioc/loader'

import morgan from 'morgan'
var logger = log4js.getLogger()
logger.level = 'debug'

container.bind<any>(TYPES.IConfig).toConstantValue(config)
const server = new InversifyExpressServer(container, null, {
  rootPath: httpRootPath,
})


server.setConfig((appp: any) => {
  appp.use(morgan(':method :url :status - :response-time ms'))
  appp.use(bodyParser.json())
  appp.use(helmet())
  appp.use(cors())
})
const app = server.build()
app.listen(httpPort, () => {
  logger.debug(
    `Servidor iniciado:  http://localhost:${httpPort}${httpRootPath}`
  )
})

exports = app
