const { encrypt, compare } = require('../../utils/bcrypt')
const db = require('../databases/db')

const registrarse = async ({ email, password, rol, lenguage }) => {
  const query = 'INSERT INTO usuarios (id, email, password, rol, lenguage) VALUES (DEFAULT, $1, $2, $3, $4) RETURNING *;'
  const values = [email, encrypt(password), rol, lenguage]
  return await db(query, values)
}

const login = async (email, password) => {
  const [user] = await db('SELECT * FROM usuarios WHERE email = $1', [email])
  return compare(password, user.password) ? [user] : []
}

const obtenerUsuario = async (id) => await db('SELECT * FROM usuarios WHERE id = $1;', [id])

module.exports = {
  login,
  registrarse,
  obtenerUsuario
}
