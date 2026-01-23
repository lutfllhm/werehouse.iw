/**
 * TEST MIGRATION SCRIPT
 * Script untuk test migration secara standalone
 */

const runMigration = require('./migrate');

async function test() {
  console.log('Starting migration test...\n');
  
  const result = await runMigration();
  
  if (result) {
    console.log('\n✅ Migration test successful!');
    process.exit(0);
  } else {
    console.log('\n❌ Migration test failed!');
    process.exit(1);
  }
}

test();
