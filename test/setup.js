import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  await mongoose.connect('mongodb://localhost:27017/todo-app-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const closeDB = async () => {
  await mongoose.connection.close();
};

export { connectDB, closeDB };
