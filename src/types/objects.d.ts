export interface Customer {
  name: string
  phone: string
  cpf: string
  birthday: string
  id?: string
}

export interface Game {
  name: string
  image: string
  stockTotal: number
  categoryId: number
  pricePerDay: number
}
