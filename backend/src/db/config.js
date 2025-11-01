const postgres = require('postgres');
const { drizzle } = require('drizzle-orm/postgres-js');
const { pets } = require('./schema');
require('dotenv').config();

// Create PostgreSQL connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Initialize postgres client
const client = postgres(connectionString, {
  ssl: 'require', // Required for Supabase
  max: 10, // Connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
});

// Initialize Drizzle ORM
const db = drizzle(client, {
  schema: { pets },
  logger: true, // Enable query logging
});

// Export both the db instance and the schema
module.exports = { db, pets, client };