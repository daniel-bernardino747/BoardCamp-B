import { Request, Response } from 'express'

import { Customer, Game, Rental, requestRental } from '../../types/objects.js'

import * as customerServices from '../services/customers.services.js'
import * as gameServices from '../services/games.services.js'
import * as rentalServices from '../services/rentals.services.js'

import * as rentalsRepo from '../repositories/rentals.repositories.js'

export async function view(req: Request, res: Response) {
  const { customerId, gameId } = req.query
  try {
    const customers = await customerServices.searchDesiredCustomers(customerId)
    const games = await gameServices.searchDesiredGames(gameId)

    const rentals = await rentalServices.joinRentalCustomersAndGames(
      customers as Array<Customer>,
      games as Array<Game>
    )
    return res.status(200).send({ message: rentals })
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}
export async function create(req: Request, res: Response) {
  const validRental: requestRental = res.locals.validRental

  try {
    const selectedGame = await gameServices.existingGame(validRental.gameId)
    const { id: gameId, pricePerDay } = selectedGame as Game
    const rental = rentalServices.calculateReturnDateAndPrice(
      pricePerDay,
      validRental
    )

    await customerServices.existingCustomer(validRental.customerId)
    await gameServices.updateStockProduct(Number(gameId))

    await rentalsRepo.createRental(rental)

    return res.sendStatus(201)
  } catch (err) {
    switch (err) {
      case 400:
        return res.sendStatus(400)
      case 404:
        return res.sendStatus(404)
      default:
        return res.status(500).send({ error: err })
    }
  }
}
export async function giveBack(req: Request, res: Response) {
  const { id } = req.params
  try {
    await rentalServices.alreadyReturnRent(Number(id))

    const rentToPay = await rentalServices.existingRent(Number(id))
    const rental = await rentalServices.defineReturnDateAndDelayFee(
      rentToPay as Rental
    )

    await rentalsRepo.finishRent(
      rental.id as string,
      rental.returnDate as string,
      rental.delayFee as number
    )

    await gameServices.updateStockProduct(rental.gameId)

    return res.sendStatus(200)
  } catch (err) {
    switch (err) {
      case 400:
        return res.sendStatus(400)
      case 404:
        return res.sendStatus(404)
      default:
        return res.status(500).send({ error: err })
    }
  }
}
export async function remove(req: Request, res: Response) {
  const { id } = req.params
  try {
    await rentalServices.existingRent(Number(id))
    await rentalServices.alreadyReturnRent(Number(id))

    await rentalsRepo.deleteRent(id)

    return res.sendStatus(200)
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}
