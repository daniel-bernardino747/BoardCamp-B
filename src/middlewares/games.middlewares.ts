import { NextFunction, Request, Response } from 'express'
import connection from '../database/index.js'
import { gameSchema } from '../models/games.models.js'
// import connection from '@/database'

export async function validateExistenceInDatabase(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { body: game } = req

  try {
    const searchCategoryInDatabase = await connection.query(
      'SELECT * FROM categories WHERE id = $1;',
      [Number(game.categoryId)]
    )
    console.log(1)
    const searchGameInDatabase = await connection.query(
      'SELECT * FROM games WHERE name = $1;',
      [game.name]
    )
    console.log(2)

    const existingCategory = !!searchCategoryInDatabase.rows.length
    const existingGame = !!searchGameInDatabase.rows.length

    if (!existingCategory) return res.sendStatus(400)
    if (existingGame) return res.sendStatus(409)
    console.log(3)

    res.locals.validGameInDatabase = game
  } catch (err) {
    return res.status(500).send({ error: err })
  }
  return next()
}
export async function validateGameSchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { validGameInDatabase } = res.locals

  try {
    const { error: validationError } = gameSchema.validate(
      validGameInDatabase,
      { abortEarly: false }
    )
    console.log(1)

    if (validationError) {
      const arrayErrors = validationError.details.map(
        (errDetail) => errDetail.message
      )
      return res.status(400).send({ error: arrayErrors })
    }
    console.log(2)

    res.locals.validGame = validGameInDatabase
  } catch (err) {
    return res.status(500).send({ error: err })
  }
  return next()
}
