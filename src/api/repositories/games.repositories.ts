import { QueryResult } from 'pg'
import connection from '../../database/index.js'
import { Game } from '../../types/objects.js'

export function viewGames(): Promise<QueryResult> {
  return connection.query('SELECT * FROM games;')
}
export function gamesToRental(): Promise<QueryResult> {
  return connection.query(
    `
  SELECT 
    games.id, 
    games.name, 
    games."categoryId", 
    categories.name AS "categoryName"
  FROM 
    games
  INNER JOIN 
    categories
  ON 
    games."categoryId"=categories.id;`
  )
}
export function oneGameToRental(id: string): Promise<QueryResult> {
  return connection.query(
    `
  SELECT 
    games.id, 
    games.name, 
    games."categoryId", 
    categories.name AS "categoryName"
  FROM 
    games
  INNER JOIN 
    categories
  ON 
    games."categoryId"=categories.id
  WHERE 
    games.id=$1;`,
    [id]
  )
}
export function searchGameById(id: number): Promise<QueryResult> {
  return connection.query('SELECT * FROM games WHERE id = $1;', [id])
}
export function searchGameByName(name: string): Promise<QueryResult> {
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
export function editOneProductToStock(
  valueStock: number,
  id: string
): Promise<QueryResult> {
  return connection.query('UPDATE games SET "stockTotal"=$1 WHERE id=$2', [
    valueStock,
    id,
  ])
}
