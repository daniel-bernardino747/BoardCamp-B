import { Request, Response } from 'express'
import connection from '../../database/index.js'
// import connection from '@/database'

export async function viewAll(req: Request, res: Response) {
  try {
    const customers = await connection.query('SELECT * FROM customers;')
    return res.status(200).send({ message: customers.rows })
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}

export async function viewOne(req: Request, res: Response) {
  const { validCustomer } = res.locals
  try {
    return res.status(200).send({ message: validCustomer })
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
export async function update(req: Request, res: Response) {
  const { id } = req.params
  const {
    newCustomer: { name, phone, cpf, birthday },
  } = res.locals

  try {
    await connection.query(
      'UPDATE customers SET name=$1,phone=$2,cpf=$3,birthday=$4 WHERE id=$5',
      [name, phone, cpf, birthday, id]
    )

    return res.sendStatus(200)
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}