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
  id?: string
}

export interface Rental {
  customerId: number
  gameId: number
  rentDate: string
  daysRented: number
  returnDate: string | null
  originalPrice: number
  delayFee: number | null
  id?: string
}

export interface requestRental {
  customerId: number
  gameId: number
  daysRented: number
}
