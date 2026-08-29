import { createError } from 'h3';
import { MongoClient, type Db } from 'mongodb';

type MongoGlobal = typeof globalThis & {
  __sazanMongoClientPromise?: Promise<MongoClient>;
};

const mongoGlobal = globalThis as MongoGlobal;

export const getMongoClient = async () => {
  const config = useRuntimeConfig();

  if (!config.mongodbUri) {
    throw createError({
      statusCode: 500,
      statusMessage: 'MongoDB is not configured. Set MONGODB_URI before using database-backed features.'
    });
  }

  if (!mongoGlobal.__sazanMongoClientPromise) {
    const client = new MongoClient(config.mongodbUri);
    mongoGlobal.__sazanMongoClientPromise = client.connect();
  }

  return mongoGlobal.__sazanMongoClientPromise;
};

export const getMongoDatabase = async (): Promise<Db> => {
  const config = useRuntimeConfig();
  const client = await getMongoClient();

  return client.db(config.mongodbDatabase || 'sazan');
};
