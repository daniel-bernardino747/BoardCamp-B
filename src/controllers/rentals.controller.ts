import { Request, Response } from 'express'
import connection from '../database/index.js'
// import connection from '@/database'

export async function view(req: Request, res: Response) {
  const { formatRental } = res.locals
  try {
    return res.status(200).send({ message: formatRental })
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}
export async function create(req: Request, res: Response) {
  const { newRental } = res.locals
  try {
    await connection.query(
      `
      INSERT INTO rentals 
      ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee")
      VALUES ($1,$2,$3,$4,$5,$6,$7);
    `,
      [
        newRental.customerId,
        newRental.gameId,
        newRental.rentDate,
        newRental.daysRented,
        newRental.returnDate,
        newRental.originalPrice,
        newRental.delayFee,
      ]
    )

    return res.sendStatus(201)
  } catch (err) {
    console.error(err)
    return res.status(500).send({ error: err })
  }
}
export async function giveBack(req: Request, res: Response) {
  const {
    finalizedRent: { id, gameId, returnDate, delayFee },
  } = res.locals
  try {
    await connection.query(
      `
      UPDATE rentals SET "returnDate"=$1,"delayFee"=$2
      WHERE id=$3;
      `,
      [returnDate, delayFee, id]
    )
    const searchGameInDatabase = await connection.query(
      'SELECT * FROM games WHERE id = $1;',
      [Number(gameId)]
    )
    const quantityInStock = searchGameInDatabase.rows[0].stockTotal
    const addItemFromStock = quantityInStock + 1
    await connection.query('UPDATE games SET "stockTotal"=$1 WHERE id=$2;', [
      addItemFromStock,
      Number(gameId),
    ])
    return res.sendStatus(200)
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}
export async function remove(req: Request, res: Response) {
  const { idValidToDelete } = res.locals
  try {
    await connection.query(`DELETE FROM rentals WHERE id=$1;`, [
      idValidToDelete,
    ])
    return res.sendStatus(200)
  } catch (err) {
    return res.status(500).send({ error: err })
  }
}
