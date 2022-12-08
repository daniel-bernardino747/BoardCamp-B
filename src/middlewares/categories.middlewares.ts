import { NextFunction, Request, Response } from 'express'
import connection from '../database/index.js'
// import connection from '@/database'

export async function validTypography(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name } = req.body
  if (!name) return res.sendStatus(400)

  const capitalize = (string: string): string => {
    return string[0].toUpperCase() + string.slice(1)
  }

  try {
    const nameCategoryInCapitalize = capitalize(name)
    res.locals.validNameCategory = nameCategoryInCapitalize
  } catch (err) {
    return res.status(500).send({ error: err })
  }
  return next()
}
export async function validateExistenceInDatabase(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { validNameCategory } = res.locals

  try {
    const searchCategoryInDatabase = await connection.query(
      'SELECT * FROM categories WHERE name = $1',
      [validNameCategory]
    )
    const existingCategory = !!searchCategoryInDatabase.rows.length

    if (existingCategory) return res.sendStatus(409)

    res.locals.validCategoryInDatabase = name
  } catch (err) {
    return res.status(500).send({ error: err })
  }
  return next()
}
