import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$/;

const SALT_ROUNDS = 10;

const currentFilePath = fileURLToPath(import.meta.url);

const currentDirectory = path.dirname(currentFilePath);

const databasePath = path.resolve(currentDirectory, '../db.json');

function isBcryptHash(password) {
  return typeof password === 'string' && BCRYPT_HASH_PATTERN.test(password);
}

async function migratePasswords() {
  const rawDatabase = await fs.readFile(databasePath, 'utf8');

  const database = JSON.parse(rawDatabase);

  if (!Array.isArray(database.users)) {
    throw new Error('db.json must contain a users array.');
  }

  let migratedCount = 0;

  const migratedUsers = await Promise.all(
    database.users.map(async (user) => {
      if (
        !user ||
        typeof user !== 'object' ||
        typeof user.password !== 'string' ||
        !user.password ||
        isBcryptHash(user.password)
      ) {
        return user;
      }

      migratedCount += 1;

      return {
        ...user,

        password: await bcrypt.hash(user.password, SALT_ROUNDS),
      };
    }),
  );

  if (migratedCount === 0) {
    console.log('Auth password migration: no plaintext passwords found.');

    return;
  }

  const nextDatabase = {
    ...database,
    users: migratedUsers,
  };

  await fs.writeFile(
    databasePath,
    `${JSON.stringify(nextDatabase, null, 2)}\n`,
    'utf8',
  );

  console.log(
    `Auth password migration: hashed ${migratedCount} existing user password(s).`,
  );
}

migratePasswords().catch((error) => {
  console.error('Auth password migration failed:', error);

  process.exitCode = 1;
});
