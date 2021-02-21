import mongoose from 'mongoose';

const connect = (db: string) => {
  const con: null | typeof mongoose = null;
  try {
    mongoose
      .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        return console.info(`Successfully connected to ${db}`);
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (err) {
    console.log('Error on connection', err);
    process.exit(1);
  }

  mongoose.connection.once('connected', () => {
    console.log('DB Connection established');
  });

  return con;
};

export const createConnection = async (url: string): Promise<void> => {
  connect(url);

  mongoose.connection.on('disconnected', () => {
    console.log('Connection closed, will recreated it!');
    connect(url);
  });
  return;
};
