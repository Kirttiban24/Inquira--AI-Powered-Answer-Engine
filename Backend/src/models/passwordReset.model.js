import mongoose from 'mongoose'

    const passwordResetSchema = new mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            token: {
                type: String,
                required: true,
            },

            expiresAt: {
                type: Date,
                required: true,
                index: true,
            },
        },
        {
            timestamps: true,
        }
    );

    const passwordResetModel = mongoose.model(
        "PasswordReset",
        passwordResetSchema
    );

export default passwordResetModel;