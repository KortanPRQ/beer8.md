import pool, { testConnection } from './connection';
import fs from 'fs';
import path from 'path';

const setupDatabase = async () => {
  console.log('🔧 Setting up Beer8 database...\n');

  // Test connection
  const connected = await testConnection();
  if (!connected) {
    console.error('Failed to connect to database. Please check your configuration.');
    process.exit(1);
  }

  try {
    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`📋 Executing ${statements.length} SQL statements...\n`);

    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }

    console.log('✅ Database schema created successfully!\n');

    // Run seeders
    console.log('🌱 Seeding database...\n');
    const { seedDatabase } = await import('./seed');
    await seedDatabase();

    console.log('\n✅ Database setup completed successfully!');
    console.log('🍺 Beer8 is ready to serve!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  setupDatabase();
}

export default setupDatabase;
