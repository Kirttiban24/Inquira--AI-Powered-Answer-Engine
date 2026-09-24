import { Router } from 'express'
import { getMeUser, loginUser, registerUser, verifyEmail, resendVerificationEmail, forgotPassword, resetPassword, logoutUser } from '../controllers/auth.controller.js'
import { registerValidation, loginValidator,resetPasswordValidation, validate } from '../validators/auth.validator.js'
import { authUser } from '../middleware/auth.middleware.js'

const authRouter = Router()

authRouter.post('/register', registerValidation, validate, registerUser)

authRouter.post('/login', loginValidator, loginUser)

authRouter.get('/get-me', authUser , getMeUser  )

authRouter.get('/verify-email', verifyEmail)

authRouter.post('/resend-verification-email', resendVerificationEmail)

authRouter.post('/forgot-password', forgotPassword)

authRouter.post('/reset-password',resetPasswordValidation, validate, resetPassword)

authRouter.post('/logout', logoutUser)

export default authRouter