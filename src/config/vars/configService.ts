import joi from 'joi'

import { IConfig } from '.'

export class ConfigService implements IConfig {
  private vars: any

  constructor() {
    this.vars = undefined
  }
  public getVars = () => {
    return this.vars
  }
  public load = () => {
    const envVarsSchema = joi
      .object({
        NODE_ENV: joi
          .string()
          .valid('development', 'testing', 'production')
          .required(),
        PORT: joi.number().default(8080),
        ROOT_PATH: joi.string().required(),
        TYPE_BD: joi.string().required(),
      })
      .unknown()
      .required()

    const { error, value: envVars } = joi.validate(process.env, envVarsSchema)
    if (error) {
      this.vars = undefined
      return `Config validation error: ${error.message}`
    }
    this.vars = {
      back: {
        tipoBD: envVars.TYPE_BD
      },
      env: envVars.NODE_ENV,
      isDev: envVars.NODE_ENV === 'development',
      isProd: envVars.NODE_ENV === 'production',
      isTest: envVars.NODE_ENV === 'testing',
      server: {
        port: Number(envVars.PORT),
        rootPath: envVars.ROOT_PATH,
      },
    }
    return null
  }
}
