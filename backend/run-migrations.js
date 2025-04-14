import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

async function runMigrations() {
  try {
    console.log('Creating Prisma migration for domain model...');
    
    // Create the migration
    const { stdout: migrateStdout, stderr: migrateStderr } = await execPromise(
      'npx prisma migrate dev --name add_domains_model'
    );
    
    console.log('Migration output:', migrateStdout);
    if (migrateStderr) console.error('Migration errors:', migrateStderr);
    
    // Generate Prisma client
    const { stdout: generateStdout, stderr: generateStderr } = await execPromise(
      'npx prisma generate'
    );
    
    console.log('Client generation output:', generateStdout);
    if (generateStderr) console.error('Client generation errors:', generateStderr);
    
    console.log('Prisma migration and client generation completed successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations(); 