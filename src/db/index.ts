// INITIALISE CONNECTION NORMALLY
/* import { drizzle } from 'drizzle-orm/pglite'

export const db = drizzle(process.env.DATABASE_URL!) */


// IF PROVIDIND EXISTING DRIVER
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

const client = new PGlite(process.env.DATABASE_URL!);
export const db = drizzle({ client });
