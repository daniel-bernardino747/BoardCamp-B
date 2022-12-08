import { Request, Response } from 'express'
import connection from '../database/index.js'
// import connection from '@/database'

export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await connection.query('SELECT * FROM categories;')
    return res.status(200).send({ message: categories.rows })
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}
