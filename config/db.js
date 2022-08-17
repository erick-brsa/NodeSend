import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(
            process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const url = `${connection.connection.host}:${connection.connection.port}`;
        console.log(`MongoDB conectado en: ${url}`);
    } catch (error) {
        console.log(`Error: ${error}`);
        process.exit(1);
    }
}

export default connectDB;