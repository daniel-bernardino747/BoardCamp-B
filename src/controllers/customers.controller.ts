import { Request, Response } from 'express'
import connection from '../database/index.js'
// import connection from '@/database'

export async function getCustomers(req: Request, res: Response) {
  try {
    const customers = await connection.query('SELECT * FROM customers;')
    return res.status(200).send({ message: customers.rows })
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}

export async function getCustomer(req: Request, res: Response) {
  const { user } = res.locals
  try {
    return res.status(200).send({ message: user })
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}
