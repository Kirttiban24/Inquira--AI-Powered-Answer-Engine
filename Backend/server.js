import "dotenv/config";
import connectDB from './src/config/database.js'
import app from './src/app.js'


const PORT = process.env.PORT || 3000

connectDB()
    .catch((error) => {
        console.error('❌ Server failed to start:', error.message)
        process.exit(1)
    })

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)
})

