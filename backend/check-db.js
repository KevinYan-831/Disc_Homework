require('dotenv').config();
const { db, pets } = require('./src/db/config');
const { sql } = require('drizzle-orm');

async function checkDatabase() {
  try {
    console.log('🔍 Checking database tables...\n');

    // Check if pets table exists
    const tableCheck = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'pets'
    `);

    if (tableCheck.length > 0) {
      console.log('✅ Table "pets" exists');

      // Get column info
      const columns = await db.execute(sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'pets'
        ORDER BY ordinal_position
      `);

      console.log('\n📋 Current schema:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : ''} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
      });

      // Get row count
      const count = await db.select().from(pets);
      console.log(`\n📊 Current rows: ${count.length}`);
      if (count.length > 0) {
        console.log('\n🐾 Sample data:');
        count.slice(0, 3).forEach(pet => {
          console.log(`  - ${pet.name} (${pet.species})`);
        });
      }
    } else {
      console.log('❌ Table "pets" does not exist');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
