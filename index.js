const Koa = require('koa')
const Router = require('koa-router')
const fs = require('fs')
const path = require('path')

const FILE_PATH = path.join(__dirname, 'data.json')

const app = new Koa()
app.use(require('@koa/cors')())
app.use(require('koa-bodyparser')())

app.use(
  new Router()
    .post('/', (ctx, next) => {
      fs.readFile(FILE_PATH, data => {
        const dataList = JSON.parse(data) || []
        dataList.push({
          info: ctx.request.body,
          date: new Date()
        })
        fs.writeFile(FILE_PATH, dataList)
        ctx.status = 204
        ctx.body = null
        next()
      })
    })
    .get('/', (ctx, next) => {
      fs.readFile(FILE_PATH, data => {
        const dataList = JSON.parse(data) || []
        ctx.body = dataList.sort((data1, data2) => data1.data > data2.data)
        ctx.status = 200
        next()
      })
    })
    .routes()
)

module.exports = app.listen(process.env.PORT || 4000)
