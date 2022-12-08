import { Request, Response } from 'express'
import connection from '../database/index.js'
// import connection from '@/database'

export async function viewAll(req: Request, res: Response) {
  try {
    const rentals = await connection.query('SELECT * FROM rentals;')
    return res.status(200).send({ message: rentals.rows })
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}
