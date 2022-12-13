import { QueryResult } from 'pg'
import connection from '../../database/index.js'
import { Game } from '../../types/objects.js'

export function viewGames(): Promise<QueryResult> {
  return connection.query('SELECT * FROM games;')
}
export function searchGame(name: string): Promise<QueryResult> {
  return connection.query('SELECT * FROM games WHERE name = $1;', [name])
}
export function createGame(game: Game): Promise<QueryResult> {
  const { name, image = null, stockTotal, categoryId, pricePerDay } = game
  return connection.query(
    `
    INSERT INTO 
      games (name,image,"stockTotal","categoryId","pricePerDay") 
    VALUES 
      ($1,$2,$3,$4,$5);`,
    [name, image, stockTotal, categoryId, pricePerDay]
  )
}
