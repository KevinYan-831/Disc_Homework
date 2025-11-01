const { pgTable, serial, text, bigint } = require('drizzle-orm/pg-core');

// Define the pets table schema - matches existing Supabase table
const pets = pgTable('Pets', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: bigint('age', { mode: 'number' }),
  weight: bigint('weight', { mode: 'number' }),
  species: text('species').notNull(),
  petUrl: text('pet_url'),
  petUrl2: text('pet_url2')
});

module.exports = { pets };