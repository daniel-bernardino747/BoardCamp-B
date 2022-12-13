import * as gamesRepo from '../repositories/games.repositories.js'

export async function validNewGame(name: string): Promise<void | number> {
  const game = await gamesRepo.searchGame(name)

  const existingGame = !!game.rows.length
  if (existingGame) throw 409
}
