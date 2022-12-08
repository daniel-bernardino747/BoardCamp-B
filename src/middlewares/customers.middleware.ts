import { NextFunction, Request, Response } from 'express'
import connection from '../database/index.js'
// import connection from '@/database'

export async function validateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params

  try {
    const user = await connection.query(
      'SELECT * FROM customers WHERE id=$1;',
      [id]
    )
    const existingUser = !!user.rows.length

    if (!existingUser) return res.sendStatus(404)

    res.locals.user = user.rows[0]
  } catch (err) {
    return res.status(500).send({ error: err })
  }
  return next()
}
