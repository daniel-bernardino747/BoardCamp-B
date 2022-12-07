import pkg from 'pg'

const { Pool } = pkg
const connection = new Pool()

export default connection
