import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";

function Register() {

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [passwordError, setPasswordError] = useState("");

    const { handleRegister } = useAuth();
    const navigate = useNavigate();

    const error = useSelector((state) => state.auth.error);
    const loading = useSelector((state) => state.auth.loading);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === "password" || name === "confirmPassword") {
            const password =
                name === "password" ? value : formData.password;

            const confirmPassword =
                name === "confirmPassword" ? value : formData.confirmPassword;

            if (confirmPassword && password !== confirmPassword) {
                setPasswordError("Passwords do not match.");
            } else {
                setPasswordError("");
            }
        }
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        setPasswordError("");

        const data = await handleRegister(formData);

        if (data?.success) {
            navigate("/verify-email", {
                state: {
                    email: formData.email
                }
            });
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">

            {/* Background gradients */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>

            {/* Register Card */}
            <div className="relative w-full max-w-md">

                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-8 shadow-2xl">

                    {/* Logo / Heading */}
                    <div className="text-center mb-8">

                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 mb-4 shadow-lg shadow-cyan-500/20">
                            <span className="text-white font-bold text-xl">
                                I
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-white">
                            Create your account
                        </h1>

                        <p className="text-slate-400 mt-2 text-sm">
                            Start your journey with Inquira
                        </p>

                    </div>

                    {error && (
                        <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmitForm} className="space-y-5">

                        {/* Username */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Username
                            </label>

                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/70 border border-slate-700 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                required
                            />
                        </div>


                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/70 border border-slate-700 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                required
                            />
                        </div>


                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/70 border border-slate-700 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                required
                            />
                        </div>


                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/70 border border-slate-700 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                required
                            />

                            {passwordError && (
                                <p className="mt-2 text-sm text-red-400">
                                    {passwordError}
                                </p>
                            )}
                            
                        </div>


                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full py-3 rounded-xl
                                font-semibold text-white
                                bg-gradient-to-r from-cyan-500 to-violet-600
                                hover:from-cyan-400 hover:to-violet-500
                                hover:-translate-y-0.5
                                active:translate-y-0.5
                                active:scale-[0.98]
                                active:shadow-none
                                transition-all duration-150 ease-out
                                shadow-lg shadow-cyan-500/20
                                hover:shadow-cyan-500/30
                                cursor-pointer
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>

                    </form>


                    {/* Login link */}
                    <p className="text-center text-sm text-slate-400 mt-6">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                            Login
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default Register;