require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { jwtSign } = require('../utils/jwt')
const { verifyToken } = require('./middlewares/event.middleware')
const {
  login,
  registrarse,
  obtenerUsuario
} = require('./models/Usuarios.dao')

const PORT = process.env.PORT ?? 3_000
const app = express()

app.use(cors())
app.use(express.json())

app.post('/usuarios', (req, res) => {
  const { email, password, rol, lenguage } = req.body

  if (!email || !password || !rol || !lenguage) {
    res.status(400).json({ error: 'Faltan datos obligatorios' })
    return
  }

  registrarse({ email, password, rol, lenguage })
    .then((user) => res.status(201).json(user))
    .catch((error) => res.status(500).json(error))
})

app.post('/login', (req, res) => {
  login(req.body.email, req.body.password)
    .then((user) => user?.email
      ? res.status(200).json({ token: jwtSign({ email: req.body.email }) })
      : res.status(404).json({ code: 404, message: 'Resource not found' })
    )
    .catch((error) => res.status(500).json(error))
})

app.get('/usuario/:id', verifyToken, (req, res) => {
  obtenerUsuario(req.params.id)
    .then((events) => res.status(200).json({ events }))
    .catch((error) => res.status(500).json(error))
})

app.all('*', (_, res) => res.status(404).json({ code: 404, message: 'Resource not found' }))

app.listen(PORT, () => console.log(`Server arriba en la URL: http://localhost:${PORT}`))
