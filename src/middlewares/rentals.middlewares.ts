import dayjs from 'dayjs'
import { NextFunction, Request, Response } from 'express'
import connection from '../database/index.js'
import { rentalSchema } from '../models/rentals.models.js'

export async function collectCustomerForRental(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { customerId } = req.query
  try {
    let customer
    if (customerId) {
      const searchCustomer = await connection.query(
        `
        SELECT customers.id, customers.name FROM customers WHERE id=$1;
      `,
        [customerId]
      )
      customer = searchCustomer
    } else {
      const searchCustomer = await connection.query(
        `
        SELECT customers.id, customers.name FROM customers;
      `
      )
      customer = searchCustomer
    }

    if (!customer.rows.length) return res.sendStatus(404)
    res.locals.customerForRental = customer
  } catch (err) {
    return res.status(500).send({ error: err })
  }
  return next()
}
export async function collectGameForRental(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { gameId } = req.query
  try {
    let game
    if (gameId) {
      const searchGame = await connection.query(
        `
        SELECT games.id, games.name, games."categoryId", categories.name AS "categoryName"
        FROM games
        INNER JOIN categories
        ON games."categoryId"=categories.id
        WHERE games.id=$1;
      `,
        [gameId]
      )
      game = searchGame
    } else {
      const searchGame = await connection.query(
        `
        SELECT games.id, games.name, games."categoryId", categories.name AS "categoryName"
        FROM games
        INNER JOIN categories
        ON games."categoryId"=categories.id;
      `
      )
      game = searchGame
    }
    if (!game.rows.length) return res.sendStatus(404)
    res.locals.gameForRental = game
  } catch (err) {
    return res.status(500).send({ error: err })
  }
  return next()
}
export async function joinCustomerAndGameInRental(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { customerForRental, gameForRental } = res.locals
  try {
    const { rows: customers } = customerForRental
    const { rows: games } = gameForRental
    let rentalRows
    if (customers.length === 1 && games.length === 1) {
      const searchRental = await connection.query(
        `
      SELECT * FROM rentals 
      WHERE 
        rentals."gameId"=$1 AND rentals."customerId"=$2;
      `,
        [games[0].id, customers[0].id]
      )
      rentalRows = searchRental.rows
    } else if (customers.length === 1) {
      const searchRental = await connection.query(
        `
      SELECT * FROM rentals 
      WHERE 
        rentals."customerId"=$1;
      `,
        [customers[0].id]
      )
      rentalRows = searchRental.rows
    } else if (games.length === 1) {
      const searchRental = await connection.query(
        `
      SELECT * FROM rentals WHERE rentals."gameId"=$1;
      `,
        [games[0].id]
      )
      rentalRows = searchRental.rows
    } else {
      const searchRental = await connection.query('SELECT * FROM rentals;')
      rentalRows = searchRental.rows
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
    res.locals.formatRental = rentalRows
  } catch (err) {
    console.error(err)
    return res.status(500).send({ error: err })
  }

  return next()
}
export async function validateExistenceCustomerAndGame(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { customerId, gameId, daysRented } = req.body
  try {
    if (!customerId && !gameId) return res.sendStatus(400)

    const searchCustomerInDatabase = await connection.query(
      'SELECT * FROM customers WHERE id = $1;',
      [Number(customerId)]
    )
    const searchGameInDatabase = await connection.query(
      'SELECT * FROM games WHERE id = $1;',
      [Number(gameId)]
    )

    const existingCustomer = !!searchCustomerInDatabase.rows.length
    const existingGame = !!searchGameInDatabase.rows.length

    if (!existingCustomer) return res.sendStatus(400)
    if (!existingGame) return res.sendStatus(400)

    res.locals.validRental = { customerId, gameId, daysRented }
    res.locals.selectedGame = searchGameInDatabase.rows
  } catch (err) {
    return res.status(500).send({ error: err })
  }
  return next()
}
export async function calculateOriginalPrice(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { validRental, selectedGame } = res.locals
  try {
    const valuePerDay = selectedGame[0].pricePerDay
    const daysRented = validRental.daysRented

    const originalPrice = daysRented * valuePerDay

    res.locals.validRental = { ...validRental, originalPrice }
  } catch (err) {
    return res.status(500).send(err)
  }
  return next()
}
export async function validateRentalSchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { validRental } = res.locals
  try {
    const rental = {
      ...validRental,
      rentDate: dayjs().format('YYYY-MM-DD'),
      returnDate: null,
      delayFee: null,
    }
    const { error: validationError } = rentalSchema.validate(rental, {
      abortEarly: false,
    })

    if (validationError) {
      const arrayErrors = validationError.details.map(
        (errDetail) => errDetail.message
      )
      return res.status(400).send({ error: arrayErrors })
    }
    res.locals.newRental = rental
  } catch (err) {
    return res.status(500).send(err)
  }
  return next()
}
export async function validateGameAvailability(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { selectedGame } = res.locals
  try {
    const idOfProduct = selectedGame[0].id
    const quantityInStock = selectedGame[0].stockTotal
    const isPossibleRent = quantityInStock - 1 !== -1

    if (!isPossibleRent) return res.sendStatus(400)

    const removeItemFromStock = quantityInStock - 1
    await connection.query('UPDATE games SET "stockTotal"=$1 WHERE id=$2', [
      removeItemFromStock,
      idOfProduct,
    ])
  } catch (err) {
    return res.status(500).send({ error: err })
  }
  return next()
}
export async function validateReturnRent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params
  try {
    const searchForIdRent = await connection.query(
      `
      SELECT * FROM rentals
      WHERE id=$1
    `,
      [id]
    )
    const searchAlreadyReturnRent = await connection.query(
      `
      SELECT * FROM rentals
      WHERE id=$1 
      AND "returnDate"<>null;
    `,
      [id]
    )

    const notExistRent = !searchForIdRent.rows.length
    const alreadyReturnRent = !!searchAlreadyReturnRent.rows.length

    if (notExistRent) return res.sendStatus(404)
    if (alreadyReturnRent) return res.sendStatus(400)

    res.locals.validRental = searchForIdRent.rows
  } catch (err) {
    return res.status(500).send({ error: err })
  }
  return next()
}
export async function prepareReturnDateAndDelayFee(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    validRental: [rental],
  } = res.locals
  try {
    rental.returnDate = new Date()
    const differenceOfDays = dayjs(rental.returnDate).diff(
      dayjs(rental.rentDate),
      'day'
    )

    const searchGameToReturnRent = await connection.query(
      `
      SELECT * FROM games
      WHERE id=$1;
    `,
      [rental.gameId]
    )
    const gameThatWasRented = searchGameToReturnRent.rows[0]
    const haveDelayFee = differenceOfDays > rental.daysRented

    if (haveDelayFee) {
      const delayedDays = differenceOfDays - rental.daysRented
      const valueDelayFee = delayedDays * gameThatWasRented.pricePerDay
      rental.delayFee = valueDelayFee
    }
    res.locals.finalizedRent = rental
  } catch (err) {
    return res.status(500).send({ error: err })
  }
  return next()
}
