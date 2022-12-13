import { ParsedQs } from 'qs'
import { Game } from '../../types/objects.js'
import * as gamesRepo from '../repositories/games.repositories.js'

export async function searchDesiredGames(
  id?: ParsedQs[string]
): Promise<Array<Game> | number> {
  const isAllGames = id === undefined

  const games = isAllGames
    ? await gamesRepo.viewGames()
    : await gamesRepo.oneGameToRental(id as string)

  const existingGames = !!games.rows.length
  if (!existingGames) throw 404

  return games.rows
}
export async function validNewGame(name: string): Promise<void | number> {
  const game = await gamesRepo.searchGameByName(name)

  const existingGame = !!game.rows.length
  if (existingGame) throw 409
}
export async function existingGame(id: number): Promise<Game | number> {
  if (!id) throw 400

  const game = await gamesRepo.searchGameById(id)
  const existingGame = !!game.rows.length
  if (!existingGame) throw 400

  return game.rows[0]
}
export async function updateStockProduct(id: number): Promise<void | number> {
  const searchGameToReturnRent = await gamesRepo.searchGameById(id)
  const game = searchGameToReturnRent.rows[0]

  const idOfProduct = game.id
  const quantityInStock = game.stockTotal
  const isPossibleRent = quantityInStock - 1 !== -1

  if (!isPossibleRent) throw 400

  const removeItemFromStock = quantityInStock - 1
  await gamesRepo.editOneProductToStock(
    removeItemFromStock,
    idOfProduct as string
  )
}
