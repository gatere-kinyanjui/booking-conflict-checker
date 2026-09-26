import { Hono } from 'hono'
import { db } from './db'
import { propertyTable } from './db/schema'
import * as z from 'zod'
import { sValidator } from '@hono/standard-validator'

const app = new Hono()
const zodSchema = z.object({
  checkInDate: z.coerce.date(),
  checkOutDate: z.coerce.date(),
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/property', sValidator('json', zodSchema), async (c) => {
  const body = c.req.valid('json')

  const [property] = await db.insert(propertyTable).values({
    checkInDate: body.checkInDate,
    checkOutDate: body.checkOutDate,
  }).returning()

  return c.json(property, 201)
})

app.onError((err, c) => {
  console.error('Index.ts error: ', err)
  return c.json({
    error: 'Server error'
  }, 500)
})

export default app


