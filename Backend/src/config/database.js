import mongoose from 'mongoose'

const connectDB = async () => {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected: ${connectionInstance.connection.host}`)
}

export default connectDB

