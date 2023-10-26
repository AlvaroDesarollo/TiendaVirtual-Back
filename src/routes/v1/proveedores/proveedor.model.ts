import joi from 'joi'

export const proveedorSchema = joi
  .object()
  .keys({
    nombre: joi.string().required(),
    correo: joi.string().required(),
    telefono: joi.number().required(),
    id: joi.number().required(),
  })
  .required()
