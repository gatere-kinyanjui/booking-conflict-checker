import { Hono } from 'hono'
import { db } from './db'
import { propertyTable } from './db/schema'
import * as z from 'zod'
import { sValidator } from '@hono/standard-validator'
import { eq } from 'drizzle-orm'

const app = new Hono()
console.log(process.memoryUsage.rss());

const zodSchema = z.object({
  checkInDate: z.coerce.date(),
  checkOutDate: z.coerce.date(),
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
console.log(process.memoryUsage.rss());


app.post('/property', sValidator('json', zodSchema), async (c) => {
  const body = c.req.valid('json')

  // FIXME: OVERLAPPING DURATION OF DAYS CAN HAPPEN!
  //          1. ENSURE NO SIMILAR CHECK-IN DATE OF THE SAME PROPERTY
  //          2. ENSURE NO CHECK-IN ON A DATE THAT IS NOT

  const propertyExists = await db.select().from(propertyTable).where(eq(propertyTable.checkInDate, body.checkInDate)).limit(1)
  if (propertyExists.length > 0) return c.json({ error: 'Booking already exists for that hour. Please pick another time.' }, 409)

  const [property] = await db.insert(propertyTable).values({
    checkInDate: body.checkInDate,
    checkOutDate: body.checkOutDate,
  }).returning()

  console.log(process.memoryUsage.rss());
  return c.json(property, 201)

})

app.get('/property', async (c) => {
  const result = await db.select().from(propertyTable)
  console.log(process.memoryUsage.rss());
  return c.json(result)
})

app.get('/property/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const [result] = await db.select().from(propertyTable).where(eq(propertyTable.id, id))

  if (!result) return c.json({ error: 'Property not found' }, 404)
  console.log(process.memoryUsage.rss());
  return c.json(result)
})



app.onError((err, c) => {
  console.error('Index.ts error: ', err)
  console.log(process.memoryUsage.rss());
  return c.json({
    error: 'Server error'
  }, 500)
})

export default app


