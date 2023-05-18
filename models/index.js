import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const connectToDatabase = () => {
    return mongoose.connect(process.env.MONGO_URI);
};

export { connectToDatabase };