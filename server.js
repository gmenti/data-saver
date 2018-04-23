const Koa = require('koa')
const Router = require('koa-router')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

const schema = new mongoose.Schema({
  identifier: String,
  data: Object,
  createdAt: Date
})

schema.index({ createdAt: -1 })

const Info = mongoose.model('Info', schema)

const app = new Koa()
app.use(require('@koa/cors')())
app.use(require('koa-bodyparser')())

app.use(
  (new Router())
    .post('/:identifier', async ctx => {
      const info = new Info({
        identifier: ctx.params.identifier,
        data: ctx.request.body,
        createdAt: new Date()
      })
      await info.save()
      ctx.body = null
      ctx.status = 204
    })
    .get('/', async ctx => {
      ctx.body = await Info.find({}).sort({ createdAt: -1 })
      ctx.status = 200
    })
    .get('/:identifier', async ctx => {
      ctx.body = await Info.find({ identifier: ctx.params.identifier }).sort({ createdAt: -1 })
      ctx.status = 200
    })
    .routes()
)

app.listen(process.env.PORT || 4000)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017')
