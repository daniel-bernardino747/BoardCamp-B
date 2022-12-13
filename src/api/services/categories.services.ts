import * as categoryRepo from '../repositories/categories.repositories.js'

export async function existingCategory(id: number): Promise<void | number> {
  const category = await categoryRepo.searchCategory(id)

  const existingCategory = !!category.rows.length
  if (!existingCategory) throw 404
}
