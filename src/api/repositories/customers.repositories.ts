import { QueryResult } from 'pg'
import { Customer } from 'types/objects.js'
import connection from '../../database/index.js'

export function viewCustomers(): Promise<QueryResult> {
  return connection.query('SELECT * FROM customers;')
}
export function viewOneCustomer(id: string): Promise<QueryResult> {
  return connection.query('SELECT * FROM customers WHERE id=$1;', [id])
}
export function createCustomer(customer: Customer): Promise<QueryResult> {
  return connection.query(
    'INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1,$2,$3,$4)',
    [customer.name, customer.phone, customer.cpf, customer.birthday]
  )
}
export function updateCustomer(customer: Customer): Promise<QueryResult> {
  return connection.query(
    'UPDATE customers SET name=$1,phone=$2,cpf=$3,birthday=$4 WHERE id=$5',
    [
      customer.name,
      customer.phone,
      customer.cpf,
      customer.birthday,
      customer.id,
    ]
  )
}
export function existingCPF(cpf: string): Promise<QueryResult> {
  return connection.query('SELECT * FROM customers WHERE cpf=$2;', [cpf])
}
export function otherCustomerWithThisCPF(
  id: string | undefined,
  cpf: string
): Promise<QueryResult> {
  return connection.query('SELECT * FROM customers WHERE id<>$1 AND cpf=$2;', [
    id,
    cpf,
  ])
}
