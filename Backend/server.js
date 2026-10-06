import "dotenv/config";
import connectDB from './src/config/database.js'
import app from './src/app.js'
import http from 'http'
import { testAi } from "./src/services/ai.service.js";
import { initSocket } from './src/sockets/server.socket.js'

const PORT = process.env.PORT || 3000

const server = http.createServer(app);

initSocket(server);

testAi()

connectDB()
    .catch((error) => {
        console.error('❌ Server failed to start:', error.message)
        process.exit(1)
    })
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)
})

