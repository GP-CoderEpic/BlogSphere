import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import{ login as authLogin } from '../store//authSlice'
import { Button, Input, Logo } from './index'
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth'
import { useForm } from 'react-hook-form'
import ButtonLoader from './ButtonLoader'

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit } = useForm();

    const login = async (data) => {
        setError("");
        setIsLoading(true);
        try {
            const session = await authService.login(data);
            if (session){
                const userData = await authService.getCurrentUser();
                if(userData){
                    dispatch(authLogin({ userData }))
                    setTimeout(() => {
                        navigate('/');
                    }, 1000);
                }
                
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className='flex items-center justify-center w-full'>
      <div className={`mx-auto w-full max-w-lg bg-white/95 rounded-2xl p-8 border border-blue-200 shadow-xl backdrop-blur-sm`}>
        <div className='mb-6 flex justify-center'>
            <span className='inline-block w-full max-w-[80px]'>
                <Logo width='100%' />
            </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight text-gray-800 mb-2">Sign in to your account</h2>
        <p className="text-center text-base text-gray-600 mb-6">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-blue-600 transition-all duration-200 hover:text-blue-800 hover:underline"
                    >
                        Sign Up
                    </Link>
        </p>
        {error && <p className='text-red-600 mt-4 text-center bg-red-50 p-3 rounded-lg border border-red-200'>{error}</p>}
        <form onSubmit={handleSubmit(login)} className='mt-6'>
          <div className='space-y-4'>
            <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: true,
              validate: {
                 matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be a valid address", //It is a regex(regular expression)
              }
            })} //name should be unique
            />
            <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: true,
            })}
            />
            <ButtonLoader 
              type="submit" 
              loading={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </ButtonLoader>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
