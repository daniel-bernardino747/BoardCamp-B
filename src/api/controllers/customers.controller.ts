import { Request, Response } from 'express'
import { Customer } from 'types/objects.js'
import * as customer from '../repositories/customers.repositories.js'
import { existingCustomer, isValidCPF } from '../services/customers.services.js'

export async function viewAll(req: Request, res: Response) {
  try {
    const customers = await customer.viewCustomers()
    return res.status(200).send({ message: customers.rows })
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}
export async function viewOne(req: Request, res: Response) {
  const id: string = req.params.id

  try {
    const customer = await existingCustomer(Number(id))

    return res.status(200).send({ message: customer })
  } catch (err) {
    switch (err) {
      case 404:
        return res.sendStatus(404)
      default:
        return res.status(500).send({ error: err })
    }
  }
}
export async function create(req: Request, res: Response) {
  const validCustomer: Customer = res.locals.validCustomer

  try {
    await isValidCPF(true, validCustomer.cpf)
    await customer.createCustomer(validCustomer)

    return res.sendStatus(201)
  } catch (err) {
    switch (err) {
      case 409:
        return res.sendStatus(409)
      default:
        return res.status(500).send({ error: err })
    }
  }
}
export async function update(req: Request, res: Response) {
  const id: string = req.params.id
  const validCustomer: Customer = res.locals.validCustomer

  try {
    await isValidCPF(false, validCustomer.cpf, id)

    await customer.updateCustomer({ ...validCustomer, id })

    return res.sendStatus(200)
  } catch (err) {
    switch (err) {
      case 409:
        return res.sendStatus(409)
      default:
        return res.status(500).send({ error: err })
    }
  }
}
