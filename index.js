const Koa = require('koa')
const Router = require('koa-router')
const fs = require('fs')
const path = require('path')

const FILE_PATH = path.join(__dirname, 'data.json')
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, JSON.stringify([]))
}

const app = new Koa()
app.use(require('@koa/cors')())
app.use(require('koa-bodyparser')())

app.use(
  (new Router())
    .post('/', ctx => new Promise(resolve => {
      fs.readFile(FILE_PATH, (err, data) => {
        var dataList = []
        if (!err) {
          try {
            dataList = JSON.parse(data)
          } catch (err) {
            dataList = []
          }
          dataList.unshift({
            info: ctx.request.body,
            date: new Date()
          })
          ctx.status = 204
          ctx.body = null
          fs.writeFile(FILE_PATH, JSON.stringify(dataList), resolve)
        } else {
          ctx.body = { message: err.message }
          ctx.status = 500
          resolve()
        }
      })
    }))
    .get('/', ctx => new Promise(resolve => {
      fs.readFile(FILE_PATH, (err, data) => {
        var dataList = []
        if (!err) {
          try {
            dataList = JSON.parse(data)
              .sort((data1, data2) => data1.data > data2.data)
          } catch (err) {
            //
          }
        }
        ctx.body = dataList
        ctx.status = 200
        resolve()
      })
    }))
    .routes()
)

app.listen(process.env.PORT || 4000)
