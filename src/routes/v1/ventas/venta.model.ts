import joi from 'joi'

export const ventaSchema = joi.object().keys({
    productos:joi.array().items({
        id: joi.string().required(),
        cantidadComprada: joi.number().required()
    }).required(),
    valorVenta: joi.number().required(),
    clienteId: joi.string().required(),
    fecha: joi.string().required(),
}).required()

export const reporteSchema = joi.object().keys({
    tipo: joi.string().required(),
    producto: joi.string().optional().allow(''),
}).required()