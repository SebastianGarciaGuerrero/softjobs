const bcrypt = require('bcrypt')

const encrypt = (password) => bcrypt.hashSync(password)

const compare = (password, encryptedPassword) => bcrypt.compareSync(password, encryptedPassword)

module.exports = {
  encrypt,
  compare
}
