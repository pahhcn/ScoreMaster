import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'
import userApi from './src/api/user.js'

const app = express()
app.use(cors())
app.use(express.json())

// 使用连接池
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'scoremaster',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})


// 引入 user 路由
app.use('/api', userApi(db))
app.listen(3000, () => {
  console.log('API server running at http://localhost:3000')
})

