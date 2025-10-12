import React from 'react'
import { Signup as SignupComponent } from '../index'

function Signup() {
  return (
    <div className="min-h-[calc(100vh-120px)] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-150 flex items-center justify-center py-8">
      <div className="max-w-md mx-auto bg-white/90 rounded-2xl shadow-2xl p-4 border border-blue-100">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-5 drop-shadow">Join Us Today</h2>
        <SignupComponent />
      </div>
    </div>
  )
}

export default Signup
