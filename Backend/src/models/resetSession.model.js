import mongoose from "mongoose";

const resetSessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        sessionToken: {
            type: String,
            required: true,
            unique: true,
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

const resetSessionModel = mongoose.model(
    "ResetSession",
    resetSessionSchema
);

export default resetSessionModel;