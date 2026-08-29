import { createError } from 'h3';
import { MongoClient, type Db } from 'mongodb';

type MongoGlobal = typeof globalThis & {
  __sazanMongoClientPromise?: Promise<MongoClient>;
};

const mongoGlobal = globalThis as MongoGlobal;

export const getMongoRuntimeConfig = () => {
  const config = useRuntimeConfig();

  return {
    uri: String(process.env.MONGODB_URI || config.mongodbUri || ''),
    database: String(process.env.MONGODB_DATABASE || config.mongodbDatabase || 'sazan')
  };
};

export const getMongoClient = async () => {
  const mongoConfig = getMongoRuntimeConfig();

  if (!mongoConfig.uri) {
    throw createError({
      statusCode: 500,
      statusMessage: 'MongoDB is not configured. Set MONGODB_URI before using database-backed features.'
    });
  }

  if (!mongoGlobal.__sazanMongoClientPromise) {
    const client = new MongoClient(mongoConfig.uri);
    mongoGlobal.__sazanMongoClientPromise = client.connect();
  }

  return mongoGlobal.__sazanMongoClientPromise;
};

export const getMongoDatabase = async (): Promise<Db> => {
  const mongoConfig = getMongoRuntimeConfig();
  const client = await getMongoClient();

  return client.db(mongoConfig.database);
};
