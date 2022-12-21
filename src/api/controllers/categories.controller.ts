import { Request, Response } from 'express'
import * as repository from '../repositories/categories.repositories.js'

export async function viewAll(req: Request, res: Response) {
  try {
    const categories = await repository.allCategories()

    return res.status(200).send({ message: categories.rows })
  } catch (err: unknown) {
    return res.status(500).send({ error: err })
  }
}

export async function create(req: Request, res: Response) {
  const newCategory: string = res.locals.validCategoryInDatabase
  try {
    await repository.createCategory(newCategory)

    return res.sendStatus(201)
  } catch (err: unknown) {
    return res.status(500).send({ error: err })
  }
}
