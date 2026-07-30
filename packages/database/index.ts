import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Placeholder Connection for Foundation Sprint
const queryClient = postgres('postgres://novanews:novanews_password@localhost:5432/novanews_db');
export const db = drizzle(queryClient);
