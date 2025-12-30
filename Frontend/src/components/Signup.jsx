import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Logo} from './index'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth'
import { login } from '../store/authSlice'
import ButtonLoader from './ButtonLoader'


function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const create = async (data) => {
        setError("")
        setIsLoading(true)
        try {
            const session = await authService.createAccount(data);
            if(session){
                // Wait a bit for session to be established
                await new Promise(resolve => setTimeout(resolve, 300));
                const currentUser = await authService.getCurrentUser();
                if(currentUser){
                    dispatch(login({userData: currentUser}))
                    // Small delay to ensure Redux state is updated before navigation
                    setTimeout(() => {
                        navigate("/");
                    }, 100);
                } else {
                    setError("Failed to get user data. Please try logging in.");
                }
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <div className="flex items-center justify-center w-full">
            <div className={`mx-auto w-full max-w-lg bg-white/95 rounded-2xl p-8 border border-blue-200 shadow-xl backdrop-blur-sm`}>
            <div className="mb-6 flex justify-center">
                    <span className="inline-block w-full max-w-[80px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight text-gray-800 mb-2">Sign up to create account</h2>
                <p className="text-center text-base text-gray-600 mb-6">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-blue-600 transition-all duration-200 hover:text-blue-800 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-4 text-center bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}

                <form onSubmit={handleSubmit(create)} className="mt-6">
                    <div className='space-y-4'>
                        <Input
                        label="Full Name: "
                        placeholder="Enter your full name"
                        {...register("name", {
                            required: true,
                        })}
                        />
                        <Input
                        label="Email: "
                        placeholder="Enter your email"
                        type="email"
                        {...register("email", {
                            required: true,
                            validate: {
                                matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                "Email address must be a valid address",
                            }
                        })}
                        />
                        <Input
                        label="Password: "
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", {
                            required: true,})}
                        />
                        <ButtonLoader 
                            type="submit" 
                            loading={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </ButtonLoader>
                    </div>
                </form>
            </div>

    </div>
  )
}

export default Signup
