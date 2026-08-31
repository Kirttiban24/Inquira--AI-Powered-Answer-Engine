import { Router } from 'express'
import { getMeUser, loginUser, registerUser, verifyEmail } from '../controllers/auth.controller.js'
import { registerValidation, loginValidator } from '../validators/auth.validator.js'
import { authUser } from '../middleware/auth.middleware.js'

const authRouter = Router()

authRouter.post('/register', registerValidation, registerUser)

authRouter.post('/login', loginValidator, loginUser)

authRouter.get('/get-me', authUser , getMeUser  )

authRouter.get('/verify-email', verifyEmail)

export default authRouter