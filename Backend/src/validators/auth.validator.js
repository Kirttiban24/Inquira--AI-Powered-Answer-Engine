import { body, validationResult } from 'express-validator'


// ── Validation result handler ─────────────────────────────────
export const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        })
    }
    next()
}

// ── Validation rules ──────────────────────────────────────────
export const registerValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')

        .isLength({ min: 8, max: 12 })
        .withMessage('Password must be between 8 characters and 12 characters')

        .matches(/[!@#$%^&*(),.?":{}|<>_\-\\[\]/~`+=;'']/)
        .withMessage('Password must contain at least one special character'),

    body('confirmPassword')
        .notEmpty()
        .withMessage('Confirm password is required')
        .custom((confirmPassword, { req }) => {
            if (confirmPassword !== req.body.password) {
                throw new Error('Passwords do not match')
            }

            return true
        }),    
]

export const loginValidator = [
    body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email"),

    body("password")
        .notEmpty().withMessage("Password is required"),
    validate    
]

export const resetPasswordValidation = [
    body('password')
        .notEmpty()
        .withMessage('Password is required')

        .isLength({ min: 8, max: 12 })
        .withMessage('Password must be between 8 characters and 12 characters')

        .matches(/[!@#$%^&*(),.?":{}|<>_\-\\[\]/~`+=;'']/)
        .withMessage('Password must contain at least one special character'),

    body('confirmPassword')
        .notEmpty()
        .withMessage('Confirm password is required')
        .custom((confirmPassword, { req }) => {
            if (confirmPassword !== req.body.password) {
                throw new Error('Passwords do not match')
            }

            return true
        })
]



