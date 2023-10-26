import joi from 'joi'

export const productoSchema = joi
  .object()
  .keys({
    valor_pesos_colombianos: joi.number().required(),
    nombre_producto: joi.string().required(),
    imagen: joi.string().required(),
    idCategoria: joi.string().required(),
    cantidad_stock: joi.number().required(),
  })
  .required()
