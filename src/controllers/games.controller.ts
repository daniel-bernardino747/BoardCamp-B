import { Request, Response } from 'express'
import connection from '../database/index.js'
// import connection from '@/database'

export async function getGames(req: Request, res: Response) {
  try {
    const games = await connection.query('SELECT * FROM games;')
    return res.status(200).send({ message: games.rows })
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}
