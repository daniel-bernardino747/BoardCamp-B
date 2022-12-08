import { Request, Response } from 'express'
import connection from '../database/index.js'
// import connection from '@/database'

export async function viewAll(req: Request, res: Response) {
  try {
    const games = await connection.query('SELECT * FROM games;')
    return res.status(200).send({ message: games.rows })
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}
export async function createOne(req: Request, res: Response) {
  const {
    validGame: { name, image = null, stockTotal, categoryId, pricePerDay },
  } = res.locals
  try {
    await connection.query(
      'INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay") VALUES ($1,$2,$3,$4,$5);',
      [name, image, stockTotal, Number(categoryId), pricePerDay]
    )
    return res.sendStatus(201)
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}
