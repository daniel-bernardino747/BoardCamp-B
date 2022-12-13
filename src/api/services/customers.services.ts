import { ParsedQs } from 'qs'
import { Customer } from '../../types/objects.js'
import * as customersRepo from '../repositories/customers.repositories.js'

export async function searchDesiredCustomers(
  id?: ParsedQs[string]
): Promise<Array<Customer> | number> {
  const isAllCustomers = id === undefined

  const customers = isAllCustomers
    ? await customersRepo.customersToRental()
    : await customersRepo.oneCustomerToRental(id as string)

  const existingCustomer = !!customers.rows.length
  if (!existingCustomer) throw 404

  return customers.rows
}
export async function existingCustomer(id: number): Promise<object | number> {
  const customers = await customersRepo.viewOneCustomer(id)

  const existingCustomer = !!customers.rows.length
  if (!existingCustomer) throw 404

  return customers.rows[0]
}
export async function isValidCPF(
  newCustomer: boolean,
  cpf: string,
  id?: string
): Promise<void | number> {
  const customer = newCustomer
    ? await customersRepo.existingCPF(cpf)
    : await customersRepo.otherCustomerWithThisCPF(id, cpf)

  const existingCustomer = !!customer.rows.length
  if (existingCustomer) throw 409
}
