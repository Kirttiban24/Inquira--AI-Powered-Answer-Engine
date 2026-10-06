import { Link } from "react-router";

function VerifyEmailSuccess() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">

            {/* Background gradients */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>

            {/* Card */}
            <div className="relative w-full max-w-md">

                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-8 shadow-2xl text-center">

                    {/* Success Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 mb-6">

                        <span className="text-3xl">
                            ✓
                        </span>

                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl font-bold text-white">
                        Email Verified Successfully!
                    </h1>

                    {/* Description */}
                    <p className="text-slate-400 mt-4 text-sm leading-6">
                        Your Inquira account has been successfully verified.
                        You can now log in to your account and start using Inquira.
                    </p>

                    {/* Login Button */}
                    <Link
                        to="/login"
                        className="block w-full mt-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 transition-all duration-300 shadow-lg shadow-cyan-500/20"
                    >
                        Go to Login
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default VerifyEmailSuccess;