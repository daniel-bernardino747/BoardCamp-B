import connection from '../../database/index.js'
import { Rental } from '../../types/objects.js'

export function allRentals() {
  return connection.query('SELECT * FROM rentals;')
}
export function searchRentById(id: number) {
  return connection.query('SELECT * FROM rentals WHERE id=$1', [id])
}
export function searchPaidRent(id: number) {
  return connection.query(
    `
    SELECT * FROM rentals
    WHERE id=$1 
    AND "returnDate"<>null;
  `,
    [id]
  )
}
export function rentalWithDesiredGame(gameId: number) {
  return connection.query(
    `
    SELECT * FROM rentals WHERE rentals."gameId"=$1;
    `,
    [gameId]
  )
}
export function rentalWithDesiredCustomer(customerId: string) {
  return connection.query(
    `
    SELECT * FROM rentals 
    WHERE 
      rentals."customerId"=$1;
    `,
    [customerId]
  )
}
export function rentalWithDesiredGameAndCustomer(
  customerId: string,
  gameId: number
) {
  return connection.query(
    `
    SELECT * FROM rentals 
    WHERE 
      rentals."gameId"=$1 AND rentals."customerId"=$2;
    `,
    [gameId, customerId]
  )
}
export function createRental(rental: Rental) {
  return connection.query(
    `
    INSERT INTO 
      rentals 
    ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee")
    VALUES 
      ($1,$2,$3,$4,$5,$6,$7);
  `,
    [
      rental.customerId,
      rental.gameId,
      rental.rentDate,
      rental.daysRented,
      rental.returnDate,
      rental.originalPrice,
      rental.delayFee,
    ]
  )
}
export function finishRent(id: string, returnDate: string, delayFee: number) {
  return connection.query(
    `
    UPDATE rentals SET "returnDate"=$1,"delayFee"=$2
    WHERE id=$3;
    `,
    [returnDate, delayFee, id]
  )
}
export function deleteRent(id: string) {
  return connection.query(`DELETE FROM rentals WHERE id=$1;`, [id])
}
