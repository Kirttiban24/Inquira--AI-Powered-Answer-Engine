import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";

function VerifyEmail() {

    const location = useLocation();

    const { handleResendVerificationEmail } = useAuth();

    const error = useSelector((state) => state.auth.error);
    const loading = useSelector((state) => state.auth.loading);

    const email = location.state?.email || "";

    const [message, setMessage] = useState("");

    const handleResend = async () => {

        if (!email) {
            return;
        }

        setMessage("");

        const data = await handleResendVerificationEmail(email);

        if (data?.success) {
            setMessage("Verification email sent successfully.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">

            {/* Background gradients */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>

            {/* Card */}
            <div className="relative w-full max-w-md">

                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-8 shadow-2xl">

                    {/* Icon */}
                    <div className="text-center mb-8">

                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 mb-5 shadow-lg shadow-cyan-500/20">

                            <span className="text-3xl">
                                📧
                            </span>

                        </div>

                        <h1 className="text-3xl font-bold text-white">
                            Check your email
                        </h1>

                        <p className="text-slate-400 mt-3 text-sm leading-6">
                            We've sent a verification link to
                        </p>

                        {email && (
                            <p className="text-cyan-400 font-medium mt-1 break-all">
                                {email}
                            </p>
                        )}

                    </div>

                    {/* Information */}
                    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 mb-6">

                        <p className="text-slate-300 text-sm leading-6">
                            Please open your email and click the
                            <span className="text-white font-medium">
                                {" "}Verify Email{" "}
                            </span>
                            link to activate your Inquira account.
                        </p>

                    </div>

                    {/* Success message */}
                    {message && (
                        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                            {message}
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Resend */}
                    <button
                        onClick={handleResend}
                        disabled={loading || !email}
                        className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? "Sending..."
                            : "Resend Verification Email"}
                    </button>

                    {/* Login */}
                    <div className="text-center mt-6">

                        <p className="text-slate-400 text-sm">
                            Already verified?
                        </p>

                        <Link
                            to="/login"
                            className="inline-block mt-2 text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                            Go to Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default VerifyEmail;