import Joi from 'joi'

export const rentalSchema = Joi.object({
  customerId: Joi.number().integer().required(),

  gameId: Joi.number().integer().required(),

  daysRented: Joi.number().integer().min(1).required(),

  rentDate: Joi.date().max('now').required(),

  originalPrice: Joi.number().required(),

  returnDate: Joi.date().max('now').allow(null).required(),

  delayFee: Joi.number().allow(null).required(),
})
