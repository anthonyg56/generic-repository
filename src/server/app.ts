require('dotenv').config()
import * as Koa from 'koa'
import * as logger from 'koa-logger'
import * as json from 'koa-json'
import * as bodyParser from 'koa-bodyparser'
import * as HttpStatus from 'http-status-codes'

import mainDb from '../database'
import UserRoutes from './routes/user.routes'

const app = new Koa()

app.use(json())
app.use(logger())
app.use(bodyParser())

/* Error handling */
app.use(async (context, next) => {
  try {
    await next()
  } catch (error) {
    context.status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR
    error.status = context.status
    context.body = { error }
    context.app.emit('error', error, context)
  }
})

/* Logger */
app.use(async (context, next) => {
  await next();
  const rt = context.response.get('X-Response-Time');
  console.log(`${context.method} ${context.url} - ${rt}`);
});

/* Response times */
app.use(async (context, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  context.set('X-Response-Time', `${ms}ms`);
})

/* Db Connection */
app.use(async (context, next) => {
  await mainDb.connect()
  context.state.db = mainDb.db
  await next()
})

/* REST API Routes */
app.use(UserRoutes.middleware())

export default app