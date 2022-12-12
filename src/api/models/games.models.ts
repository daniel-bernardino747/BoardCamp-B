import Joi from 'joi'

export const gameSchema = Joi.object({
  name: Joi.string().required(),

  image: Joi.string()
    .uri()
    .regex(
      /^(http(s):\/\/.)[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)$/
    ),

  stockTotal: Joi.number().integer().min(1).required(),

  categoryId: Joi.number().integer().required(),

  pricePerDay: Joi.number().min(1).required(),
})
