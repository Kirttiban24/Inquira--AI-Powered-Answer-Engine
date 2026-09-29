import { useState } from "react";
import { Link,useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

function Login() {

    const [formData, setFormData] = useState({email: "",password: ""});

    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.auth.loading);

    const { handleLogin } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const navigate = useNavigate();

    const handleSubmitForm = async (e) => {
    e.preventDefault();

    const data = await handleLogin(formData);

    if (data?.success) {
        navigate("/");
    }
};

    if(!loading && user) {
        return <Navigate to="/" replace />
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">

            {/* Background gradients */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>


            {/* Login Card */}
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
                            Welcome back
                        </h1>

                        <p className="text-slate-400 mt-2 text-sm">
                            Login to continue to Inquira
                        </p>

                    </div>


                    <form onSubmit={handleSubmitForm} className="space-y-5">

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
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/70 border border-slate-700 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                required
                            />
                        </div>


                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">

                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium text-slate-300"
                                >
                                    Password
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="text-xs text-cyan-400 hover:text-cyan-300"
                                >
                                    Forgot password?
                                </Link>

                            </div>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/70 border border-slate-700 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                required
                            />
                        </div>


                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
                        >
                            Login
                        </button>

                    </form>


                    {/* Register link */}
                    <p className="text-center text-sm text-slate-400 mt-6">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                            Create account
                        </Link>
                    </p>

                </div>
            </div>

        </div>
    );
}

export default Login;