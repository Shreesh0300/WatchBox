const mongoose = require('mongoose');
const uri = 'mongodb+srv://iamnoob0300_db_user:12345@watch-box-cluster.mubqjg0.mongodb.net/watchbox?appName=Watch-Box-Cluster';

mongoose.connect(uri)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
