import { NextFunction, Request, Response } from 'express'
import connection from '../database/index.js'
import { customerSchema } from '../models/customers.models.js'
// import connection from '@/database'

export async function validateExistenceCustomer(
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

    res.locals.validUserInDatabase = user.rows[0]
  } catch (err) {
    return res.status(500).send({ error: err })
  }
  return next()
}
export async function validateCustomerSchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { body: customer } = req

  try {
    const { error: validationError } = customerSchema.validate(customer, {
      abortEarly: false,
    })

    if (validationError) {
      const arrayErrors = validationError.details.map(
        (errDetail) => errDetail.message
      )
      return res.status(400).send({ error: arrayErrors })
    }

    res.locals.validCustomerSchema = customer
  } catch (err) {
    return res.status(500).send({ error: err })
  }
  return next()
}
export async function validateUsedCPF(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { validCustomerSchema } = res.locals

  try {
    const searchCustomerInDatabase = await connection.query(
      'SELECT * FROM customers WHERE cpf=$1',
      [validCustomerSchema.cpf]
    )
    const existingCustomer = !!searchCustomerInDatabase.rows.length
    if (existingCustomer) return res.sendStatus(409)

    res.locals.newCustomer = validCustomerSchema
  } catch (err) {
    return res.status(500).send({ error: err })
  }
  return next()
}
