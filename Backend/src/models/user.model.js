import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
)

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
})

// Compare plain password with hashed password
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}

const userModel = mongoose.model('user', userSchema)

export default userModel

