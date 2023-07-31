const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')

const app = express()
const PORT = 3000

const db = require('./models')
const Todo = db.Todo
const User = db.User

app.engine('hbs', exphbs({ defaultLayout: "main", extname: ".hbs" }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// routes
// home
app.get('/', (req, res) => {
  // 資料轉換成 plain object: 查詢多筆資料：要在 findAll({ raw: true, nest: true}) 直接傳入參數
  return Todo.findAll({
    raw: true,
    nest: true
  })
    .then((todos) => { return res.render('index', { todos: todos }) })
    .catch((error) => { return res.status(422).json(error) })
})

// login
app.get('/users/login', (req, res) => {
  res.render('login')
})

app.post('/users/login', (req, res) => {
  res.send('login')
})

//register
app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.create({ name, email, password })
    .then(user => res.redirect('/'))
})

//logout
app.get('/users/logout', (req, res) => {
  res.send('logout')
})

// details
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  // 資料轉換成 plain object: 查詢單筆資料：在 res.render 時在物件實例 todo 後串上 todo.toJSON()
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

// listen
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})