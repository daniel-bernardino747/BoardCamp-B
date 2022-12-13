import dayjs from 'dayjs'
import { Customer, Game, Rental, requestRental } from '../../types/objects'
import {
  editOneProductToStock,
  searchGameById,
} from '../repositories/games.repositories.js'
import * as rentalsRepo from '../repositories/rentals.repositories.js'

export async function alreadyReturnRent(id: number): Promise<void | number> {
  const rent = await rentalsRepo.searchPaidRent(id)

  const alreadyPaid = !!rent.rows.length
  if (alreadyPaid) throw 400
}
export async function joinRentalCustomersAndGames(
  customers: Array<Customer>,
  games: Array<Game>
): Promise<object | number> {
  const oneData = 1
  const oneCustomer = customers.length === oneData ? 1 : 0
  const oneGame = games.length === oneData ? 2 : 0
  const clientSurvey = oneCustomer + oneGame
  let rentalRows
  switch (clientSurvey) {
    case 3:
      rentalRows = (
        await rentalsRepo.rentalWithDesiredGameAndCustomer(
          customers[0].id as string,
          games[0].categoryId
        )
      ).rows
      break
    case 2:
      rentalRows = (
        await rentalsRepo.rentalWithDesiredGame(games[0].categoryId)
      ).rows
      break
    case 1:
      rentalRows = (
        await rentalsRepo.rentalWithDesiredCustomer(customers[0].id as string)
      ).rows
      break
    default:
      rentalRows = (await rentalsRepo.allRentals()).rows
      break
  }

  for (let i = 0; i < rentalRows.length; i = i + 1) {
    for (let e = 0; e < customers.length || e < games.length; e = e + 1) {
      if (rentalRows[i].customerId === customers[e].id) {
        rentalRows[i] = { ...rentalRows[i], customer: customers[e] }
        break
      }
    }
  }
  for (let m = 0; m < rentalRows.length; m = m + 1) {
    for (let n = 0; n < games.length; n = n + 1) {
      if (rentalRows[m].gameId === games[n].id) {
        rentalRows[m] = { ...rentalRows[m], game: games[n] }
      }
    }
  }
  return rentalRows
}
export function calculateReturnDateAndPrice(
  valuePerDay: number,
  requestRental: requestRental
): Rental {
  const daysRented = requestRental.daysRented

  const originalPrice = daysRented * valuePerDay
  const rentDate = dayjs().format('YYYY-MM-DD')

  const rental: Rental = {
    ...requestRental,
    rentDate,
    returnDate: null,
    originalPrice,
    delayFee: null,
  }
  return rental
}
export async function defineReturnDateAndDelayFee(
  rental: Rental
): Promise<Rental> {
  rental.returnDate = dayjs().format()

  const differenceOfDays = dayjs(rental.returnDate).diff(
    dayjs(rental.rentDate),
    'day'
  )

  const searchGameToReturnRent = await searchGameById(rental.gameId)
  const gameThatWasRented = searchGameToReturnRent.rows[0]

  const haveDelayFee = differenceOfDays > rental.daysRented

  if (haveDelayFee) {
    const delayedDays = differenceOfDays - rental.daysRented
    const valueDelayFee = delayedDays * gameThatWasRented.pricePerDay

    rental.delayFee = valueDelayFee
  }

  return rental
}
export async function existingRent(id: number): Promise<Rental | number> {
  const rent = await rentalsRepo.searchRentById(id)

  const notExistRent = !rent.rows.length
  if (notExistRent) throw 404

  return rent.rows[0]
}
export async function returnProductToStock(id: number): Promise<void> {
  const searchGameToReturnRent = await searchGameById(id)
  const quantityInStock = searchGameToReturnRent.rows[0].stockTotal

  const addItemFromStock = quantityInStock + 1
  await editOneProductToStock(addItemFromStock, id.toString())
}
