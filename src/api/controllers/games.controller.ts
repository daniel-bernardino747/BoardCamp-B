import { Request, Response } from 'express'
import { Game } from '../../types/objects.js'
import * as gamesRepo from '../repositories/games.repositories.js'
import { existingCategory } from '../services/categories.services.js'
import { validNewGame } from '../services/games.services.js'

export async function viewAll(req: Request, res: Response) {
  try {
    const games = await gamesRepo.viewGames()

    return res.status(200).send({ message: games.rows })
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}
export async function createOne(req: Request, res: Response) {
  const validGame: Game = res.locals.validGame

  try {
    await existingCategory(validGame.categoryId)
    await validNewGame(validGame.name)

    await gamesRepo.createGame(validGame)

    return res.sendStatus(201)
  } catch (err) {
    switch (err) {
      case 404:
        return res.sendStatus(404)
      case 409:
        return res.sendStatus(409)
      default:
        return res.status(500).send({ error: err })
    }
  }
}
