import React from 'react'
import {Login as LoginComponent} from '../index'

function Login() {
  return (
    <div className="min-h-[calc(100vh-120px)] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-150 flex items-center justify-center mb-2 py-8">
      <div className="w-full max-w-md mx-auto bg-white/90 rounded-2xl shadow-2xl p-4 border border-blue-100">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-5 drop-shadow">Welcome Back</h2>
        <LoginComponent />
      </div>
    </div>
  )
}

export default Login
