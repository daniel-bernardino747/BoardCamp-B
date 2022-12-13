import { requestRental } from './../../types/objects.d'

import { NextFunction, Request, Response } from 'express'
import connection from '../../database/index.js'
import { rentalSchema } from '../models/rentals.models.js'

export async function validateRentalSchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const rental: requestRental = req.body
  try {
    const { error: validationError } = rentalSchema.validate(rental, {
      abortEarly: false,
    })

    if (validationError) {
      const arrayErrors = validationError.details.map(
        (errDetail) => errDetail.message
      )
      return res.status(400).send({ error: arrayErrors })
    }
    res.locals.validRental = rental
  } catch (err) {
    return res.status(500).send(err)
  }
  return next()
}
export async function validateToDeleteRental(
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
    const notExistRent = !searchForIdRent.rows.length
    const alreadyReturnRent = searchForIdRent.rows[0].returnDate !== null

    if (notExistRent) return res.sendStatus(404)
    if (!alreadyReturnRent) return res.sendStatus(400)

    res.locals.idValidToDelete = id
  } catch (err) {
    return res.status(500).send({ error: err })
  }
  return next()
}
