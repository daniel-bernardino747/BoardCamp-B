import { Request, Response } from 'express'
import connection from '../database/index.js'
// import connection from '@/database'

export async function viewAll(req: Request, res: Response) {
  try {
    const categories = await connection.query('SELECT * FROM categories;')
    return res.status(200).send({ message: categories.rows })
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}
export async function create(req: Request, res: Response) {
  const { newCategory } = res.locals
  try {
    await connection.query('INSERT INTO categories (name) VALUES ($1);', [
      newCategory,
    ])
    return res.sendStatus(201)
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}
