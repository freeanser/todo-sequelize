// 引用 passport，放在文件上方
const passport = require('passport')
const express = require('express')
const session = require('express-session')
// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')
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
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

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

// app.post('/users/login', (req, res) => {
//   res.send('login')
// })

// 加入 middleware，驗證 reqest 登入狀態
app.post('/users/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

//register
app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  // Model.findOne({ where: { } })：用條件查詢一筆資料
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      console.log('User already exists')
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

//logout
app.get('/users/logout', (req, res) => {
  res.send('logout')
})

// details
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  // 資料轉換成 plain object: 查詢單筆資料：在 res.render 時在物件實例 todo 後串上 todo.toJSON()
  return Todo.findByPk(id) // 在 MySQL 資料庫裡，id 通常是單純的流水號數字
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

// listen
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})