import userModel from '../models/user.model.js'
import passwordResetModel from '../models/passwordReset.model.js'
import resetSessionModel from "../models/resetSession.model.js"
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { sendEmail } from '../services/mail.service.js'

export async function registerUser(req, res) {
    const { username, email, password } = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{email}, {username}]
    })

    if(isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with this email or username already exists",
            success: false,
            err: "User already exists"
        })
    }

    const user = await userModel.create({username, email, password})

    const emailVerificationToken = jwt.sign({
        email: user.email,

    },process.env.JWT_SECRET)

    await sendEmail({
        to: email,
        subject: "Welcome to Inquira!!",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Inquira</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}" >Verify Email</a>
                <p>If you did not create an account, please ignore this email</p>
                <p>Best regards,<br>The Inquira Team</p>`
    })

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

export async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })

    if(!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "User not found"
        })
    }

    const isPasswordMatch = await user.comparePassword(password)

    if(!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        })
    }

    if(!user.verified) {
        return res.status(400).json({
            message: "Please verify your email before logging in",
            success: false,
            err: "Email not verified"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

export async function getMeUser(req, res) {
    const userId = req.user.id

    const user = await userModel.findById(userId).select("-password")

    if(!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    })
}

export async function verifyEmail(req, res) {
    const { token } = req.query;

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({email: decoded.email});

        if (!user) {
            return res.status(400).json({
             message: "Invalid token",
                success: false,
             err: "User not found"
            })
        }

        user.verified = true;

        await user.save();

        return res.redirect(
            "http://localhost:5173/verify-email/success"
        );

        const html = 
        `
            <h1>Email Verified Successfully</h1>
            <p>Your email has been verified. You can now login to your account.</p>
            <a href="http://localhost:3000/login">Login</a>    
        `
        return res.send(html);

    } catch(err) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: err.message
        })
    }
}

export async function resendVerificationEmail(req, res) {
    const { email } = req.body;

    const user = await userModel.findOne({ email })

    if(!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    if(user.verified) {
        return res.status(400).json({
            success: false,
            message: "Email is already verified"
        })
    }

    const emailVerificationToken = jwt.sign({
        email: user.email
    },process.env.JWT_SECRET,
    { expiresIn: '30m' })

    await sendEmail({
        to: user.email,
        subject: "Verify your Inquira account",
        html: `
            <h2>Hello, ${user.username}</h2>
            <p>You requested a new verification email.</p>
            <p>Please click the link below to verify your email:</p>
            <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
            <p>This link will expire in 30minutes.</p>
        `
    })

    return res.status(200).json({
        success: true,
        message: "Verification email sent successfully"
    }
    )
}

export async function forgotPassword(req, res) {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    // Don't reveal whether this email exists
    if (!user) {
        return res.status(200).json({
            success: true,
            message:
                "If an account exists with this email, a password reset link has been sent."
        });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token before storing it in MongoDB
    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Token expires after 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Remove previous reset requests for this user
    await passwordResetModel.deleteMany({
        user: user._id
    });

    // Store the HASHED token
    await passwordResetModel.create({
        user: user._id,
        token: hashedToken,
        expiresAt
    });

    // Raw token goes into the email
    const resetLink =
        `http://localhost:3000/api/auth/reset-password?token=${resetToken}`;

    await sendEmail({
        to: user.email,
        subject: "Reset your Inquira password",
        html: `
            <h2>Hello ${user.username}</h2>

            <p>
                We received a request to reset your Inquira password.
            </p>

            <p>
                Click the link below to create a new password:
            </p>

            <a href="${resetLink}">
                Reset Password
            </a>

            <p>
                This link will expire in 15 minutes.
            </p>

            <p>
                If you did not request a password reset,
                you can safely ignore this email.
            </p>
        `
    });

    return res.status(200).json({
        success: true,
        message:
            "If an account exists with this email, a password reset link has been sent."
    });
}

export async function resetPassword(req, res) {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({
            success: false,
            message: "New password is required",
        });
    }

    const sessionToken = req.cookies.resetSession;

    if (!sessionToken) {
        return res.status(401).json({
            success: false,
            message: "Password reset session is missing or expired",
        });
    }

    const hashedSessionToken = crypto
        .createHash("sha256")
        .update(sessionToken)
        .digest("hex");

    const resetSession = await resetSessionModel.findOne({
        sessionToken: hashedSessionToken,
    });

    if (!resetSession) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired password reset session",
        });
    }

    if (resetSession.expiresAt < new Date()) {
        await resetSessionModel.deleteOne({
            _id: resetSession._id,
        });

        res.clearCookie("resetSession");

        return res.status(401).json({
            success: false,
            message: "Password reset session has expired",
        });
    }

    const user = await userModel.findById(resetSession.user);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    user.password = password;

    await user.save();

    // Delete reset session after successful password reset
    await resetSessionModel.deleteOne({
        _id: resetSession._id,
    });

    // Remove reset cookie
    res.clearCookie("resetSession");

    return res.status(200).json({
        success: true,
        message:
            "Password reset successfully. Please login with your new password.",
    });
}

export async function verifyResetToken(req, res) {
    const { token } = req.query;

    if (!token) {
        return res.redirect(
            "http://localhost:5173/forgot-password?error=invalid-reset-link"
        );
    }

    try {
        // Hash the raw token from the email
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find reset token
        const resetRequest = await passwordResetModel.findOne({
            token: hashedToken,
        });

        if (!resetRequest) {
            return res.redirect(
                "http://localhost:5173/forgot-password?error=invalid-reset-link"
            );
        }

        // Check expiration
        if (resetRequest.expiresAt < new Date()) {
            await passwordResetModel.deleteOne({
                _id: resetRequest._id,
            });

            return res.redirect(
                "http://localhost:5173/forgot-password?error=expired-reset-link"
            );
        }

        // Generate temporary reset-session token
        const resetSessionToken = crypto
            .randomBytes(32)
            .toString("hex");

        const hashedSessionToken = crypto
            .createHash("sha256")
            .update(resetSessionToken)
            .digest("hex");

        // Reset session expires in 10 minutes
        const expiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );

        // Remove previous reset sessions for this user
        await resetSessionModel.deleteMany({
            user: resetRequest.user,
        });

        // Create new reset session
        await resetSessionModel.create({
            user: resetRequest.user,
            sessionToken: hashedSessionToken,
            expiresAt,
        });

        // Delete the original password reset token
        await passwordResetModel.deleteOne({
            _id: resetRequest._id,
        });

        // Give browser the temporary reset cookie
        res.cookie("resetSession", resetSessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 10 * 60 * 1000,
        });

        // Redirect to clean frontend URL
        return res.redirect(
            "http://localhost:5173/reset-password"
        );

    } catch (error) {
        console.error(
            "Reset token verification failed:",
            error.message
        );

        return res.redirect(
            "http://localhost:5173/forgot-password?error=invalid-reset-link"
        );
    }
}

export async function logoutUser(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    return res.status(200).json({
        success: true,
        message: "Logout successful"
    });
}



