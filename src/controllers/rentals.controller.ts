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
