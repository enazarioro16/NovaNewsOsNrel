export * from './schema/news';
export * from './schema/source';
export * from './schema/auth';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as newsSchema from './schema/news';
import * as sourceSchema from './schema/source';
import * as authSchema from './schema/auth';

// Evitar conectar en build-time si no hay DB real
const dbUrl = process.env.DATABASE_URL || "postgresql://novanews:novanews_prod_password@192.168.101.10:5432/novanews_prod_db";
const queryClient = postgres(dbUrl, { max: 1 });
export const db = drizzle(queryClient, { schema: { ...newsSchema, ...sourceSchema, ...authSchema } });
