import { NextFunction, Request, Response } from 'express'
import { Game } from '../../types/objects.js'
import { gameSchema } from '../models/games.models.js'

export async function validateGameSchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const game: Game = req.body

  try {
    const { error: validationError } = gameSchema.validate(game, {
      abortEarly: false,
    })

    if (validationError) {
      const arrayErrors = validationError.details.map(
        (errDetail) => errDetail.message
      )
      return res.status(400).send({ error: arrayErrors })
    }

    res.locals.validGame = game
  } catch (err) {
    return res.status(500).send({ error: err })
  }
  return next()
}
