import mongoose from 'mongoose';

mongoose.Promise = Promise;

// Connect to cluster in mongo atlas
mongoose.connect(
  'mongodb+srv://admin:12345@atlascluster.bcpj66h.mongodb.net/?retryWrites=true&w=majority',
  (err: Error) => {
    if (err) throw err;
    console.log('Connected to Mongo');
  }
);

const conn = mongoose.connection;

// Conection error
conn.on('error', () => console.error.bind(console, 'connection error'));

// Open connection
conn.once('open', () => console.info('Connection to Database is successful'));

export default mongoose;
