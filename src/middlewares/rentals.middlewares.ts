import { NextFunction, Request, Response } from 'express'
import connection from '../database/index.js'

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
