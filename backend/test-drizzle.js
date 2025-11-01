require('dotenv').config();
const { db, pets } = require('./src/db/config');

async function testDrizzle() {
  try {
    console.log('🔄 Testing Drizzle query...\n');

    // Try to fetch all pets
    const allPets = await db.select().from(pets).orderBy(pets.id);

    console.log('✅ Query successful!');
    console.log(`📊 Found ${allPets.length} pets\n`);

    if (allPets.length > 0) {
      console.log('🐾 Pets data:');
      allPets.forEach(pet => {
        console.log(`  - ID: ${pet.id}, Name: ${pet.name}, Species: ${pet.species}`);
      });
    } else {
      console.log('No pets found in database');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('\nFull error details:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

testDrizzle();
