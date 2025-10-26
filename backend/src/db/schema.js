const { query } = require('./config');

/**
 * Database Schema for Pet Your Pet Application
 *
 * Table: Pets
 * Columns:
 * - id: SERIAL PRIMARY KEY
 * - name: VARCHAR(100) NOT NULL
 * - species: VARCHAR(50) NOT NULL
 * - age: INTEGER
 * - weight: DECIMAL(5,2)
 * - pet_url: TEXT (URL to default pet image)
 * - pet_url2: TEXT (URL to petted/happy pet image)
 * - created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */

/**
 * Create the Pets table if it doesn't exist
 */
const createPetsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS pets (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      species VARCHAR(50) NOT NULL,
      age INTEGER,
      weight DECIMAL(5,2),
      pet_url TEXT,
      pet_url2 TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await query(createTableQuery);
    console.log(' Pets table created or already exists');
  } catch (error) {
    console.error('L Error creating Pets table:', error);
    throw error;
  }
};

/**
 * Insert sample pets data (for development/testing)
 */
const insertSamplePets = async () => {
  const checkQuery = 'SELECT COUNT(*) FROM pets';
  const result = await query(checkQuery);

  // Only insert if table is empty
  if (parseInt(result.rows[0].count) === 0) {
    const insertQuery = `
      INSERT INTO pets (name, species, age, weight, pet_url, pet_url2)
      VALUES
        ('Whiskers', 'Cat', 3, 4.5, 'https://example.com/cat1.jpg', 'https://example.com/cat1-happy.jpg'),
        ('Buddy', 'Dog', 5, 15.0, 'https://example.com/dog1.jpg', 'https://example.com/dog1-happy.jpg'),
        ('Fluffy', 'Rabbit', 2, 2.0, 'https://example.com/rabbit1.jpg', 'https://example.com/rabbit1-happy.jpg')
      ON CONFLICT DO NOTHING;
    `;

    try {
      await query(insertQuery);
      console.log(' Sample pets data inserted');
    } catch (error) {
      console.error('L Error inserting sample pets:', error);
      throw error;
    }
  } else {
    console.log('9  Pets table already has data, skipping sample insert');
  }
};

/**
 * Initialize database schema
 */
const initializeDatabase = async () => {
  try {
    console.log('=' Initializing database schema...');
    await createPetsTable();
    // Uncomment the line below if you want to auto-insert sample data
    // await insertSamplePets();
    console.log(' Database schema initialized successfully');
  } catch (error) {
    console.error('L Failed to initialize database:', error);
    throw error;
  }
};

module.exports = {
  createPetsTable,
  insertSamplePets,
  initializeDatabase
};
