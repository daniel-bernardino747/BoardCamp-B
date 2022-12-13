import { QueryResult } from 'pg'
import connection from '../../database/index.js'

export function allCategories(): Promise<QueryResult> {
  return connection.query('SELECT * FROM categories;')
}
export function searchCategory(id: number): Promise<QueryResult> {
  return connection.query('SELECT * FROM categories WHERE id = $1;', [id])
}
export function createCategory(params: string): Promise<QueryResult> {
  return connection.query('INSERT INTO categories (name) VALUES ($1);', [
    params,
  ])
}
