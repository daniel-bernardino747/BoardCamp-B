import { Request, Response } from 'express'
import connection from '../database/index.js'
// import connection from '@/database'

export async function viewAll(req: Request, res: Response) {
  try {
    const customers = await connection.query('SELECT * FROM customers;')
    return res.status(200).send({ message: customers.rows })
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}

export async function ViewOne(req: Request, res: Response) {
  const { user } = res.locals
  try {
    return res.status(200).send({ message: user })
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}
export async function create(req: Request, res: Response) {
  const {
    newCustomer: { name, phone, cpf, birthday },
  } = res.locals

  try {
    await connection.query(
      'INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1,$2,$3,$4)',
      [name, phone, cpf, birthday]
    )

    return res.sendStatus(201)
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}
