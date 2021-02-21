import mongoose, { Mongoose } from 'mongoose';

export const createConnection: mongoose.Connection = (url: string) => {
  mongoose.connect(url);
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error'));
  db.once('open', function callback() {
    console.log('Connection with database succeeded.');
  });

  return db;
};
