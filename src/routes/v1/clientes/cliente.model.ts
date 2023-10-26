import joi from 'joi'

export const clienteSchema = joi
  .object()
  .keys({
    id: joi.string().required(),
    nombre: joi.string().required(),
    correo: joi.string().required(),
    telefono: joi.string().required(),
  })
  .required()
