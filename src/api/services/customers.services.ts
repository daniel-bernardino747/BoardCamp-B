import * as customers from '../repositories/customers.repositories.js'

export async function existingCustomer(id: string): Promise<object | number> {
  const user = await customers.viewOneCustomer(id)

  const existingUser = !!user.rows.length
  if (!existingUser) throw 404

  return user.rows[0]
}
export async function isValidCPF(
  newCustomer: boolean,
  cpf: string,
  id?: string
): Promise<void | number> {
  const customer = newCustomer
    ? await customers.existingCPF(cpf)
    : await customers.otherCustomerWithThisCPF(id, cpf)

  const existingCustomer = !!customer.rows.length
  if (existingCustomer) throw 409
}
