import mongoose from "mongoose";
mongoose.set('strictQuery', false);


const connectingDB = async () => {
    try {
        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Base de datos online');
    } catch (error) {
        console.log(`error: ${error}`);
        process.exit(1)
    }
}

export default connectingDB;