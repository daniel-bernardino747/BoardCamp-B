import { NextFunction, Request, Response } from 'express'
import connection from '../database/index.js'
// import connection from '@/database'

function capitalize(string: string): string {
  return string[0].toUpperCase() + string.slice(1)
}

export async function validateNewCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name } = req.body

  if (!name) return res.sendStatus(400)
  const nameCategoryInCapitalize = capitalize(name)

  try {
    const searchCategoryInDatabase = await connection.query(
      'SELECT * FROM categories WHERE name = $1',
      [nameCategoryInCapitalize]
    )
    const existingCategory = !!searchCategoryInDatabase.rows.length

    if (existingCategory) return res.sendStatus(409)

    res.locals.newCategory = name
  } catch (err) {
    return res.status(500).send({ error: err })
  }
  return next()
}
