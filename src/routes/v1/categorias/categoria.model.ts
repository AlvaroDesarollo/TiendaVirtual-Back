import joi from 'joi'

export const categoriaSchema = joi
  .object()
  .keys({
    nombreCategoria: joi.string().required(),
  })
  .required()
