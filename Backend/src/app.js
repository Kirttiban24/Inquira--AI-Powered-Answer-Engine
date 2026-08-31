import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './router/auth.routes.js'

const app = express()

// ── Middleware ────────────────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ── Health check ──────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Inquira API is running 🚀' })
})

// ── Routes (add here later) ───────────────────────────────────

app.use('/api/auth', authRouter)

export default app
