import { useDispatch } from 'react-redux'

import {
    register,
    login,
    getMe,
    logout,
    resendVerificationEmail,
    forgotPassword,
    resetPassword
} from '../service/auth.api'

import {
    setUser,
    setLoading,
    setError,
    clearError
} from '../auth.slice'


export function useAuth() {

    const dispatch = useDispatch()


    async function handleRegister({
        email,
        username,
        password,
        confirmPassword
    }) {
        try {

            dispatch(clearError())
            dispatch(setLoading(true))

            const data = await register({
                email,
                username,
                password,
                confirmPassword
            })

            dispatch(setUser(data.user))

            return data

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    'An error occurred during registration.'
                )
            )

        } finally {
            dispatch(setLoading(false))
        }
    }


    async function handleLogin({ email, password }) {
        try {

            dispatch(clearError())
            dispatch(setLoading(true))

            const data = await login({
                email,
                password
            })

            dispatch(setUser(data.user))

            return data

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    'An error occurred during login.'
                )
            )

        } finally {
            dispatch(setLoading(false))
        }
    }


    async function handleGetMe() {
        try {

            dispatch(clearError())
            dispatch(setLoading(true))

            const data = await getMe()

            dispatch(setUser(data.user))

            return data

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    'An error occurred while fetching user information.'
                )
            )

        } finally {
            dispatch(setLoading(false))
        }
    }


    async function handleLogout() {
        try {

            dispatch(clearError())
            dispatch(setLoading(true))

            const data = await logout()

            dispatch(setUser(null))

            return data

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    'An error occurred during logout.'
                )
            )

        } finally {
            dispatch(setLoading(false))
        }
    }


    async function handleResendVerificationEmail(email) {
        try {

            dispatch(clearError())
            dispatch(setLoading(true))

            const data = await resendVerificationEmail(email)

            return data

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    'An error occurred while resending verification email.'
                )
            )

        } finally {
            dispatch(setLoading(false))
        }
    }


    async function handleForgotPassword(email) {
        try {

            dispatch(clearError())
            dispatch(setLoading(true))

            const data = await forgotPassword(email)

            return data

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    'An error occurred while sending forgot password email.'
                )
            )

        } finally {
            dispatch(setLoading(false))
        }
    }


    async function handleResetPassword({
        password,
        confirmPassword
    }) {
        try {

            dispatch(clearError())
            dispatch(setLoading(true))

            const data = await resetPassword({
                password,
                confirmPassword
            })

            return data

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    'An error occurred while resetting password.'
                )
            )

        } finally {
            dispatch(setLoading(false))
        }
    }


    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout,
        handleResendVerificationEmail,
        handleForgotPassword,
        handleResetPassword
    }
}