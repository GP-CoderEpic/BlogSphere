import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../index'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <Container>
        <div className="text-center">
          {/* 404 Animation */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
              404
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
              The page you're looking for seems to have wandered off into the digital void. 
              Don't worry, even the best bloggers get lost sometimes!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
            >
              🏠 Go Home
            </Link>
            <Link
              to="/all-posts"
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
            >
              📝 Browse Posts
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg shadow-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
            >
              ⬅️ Go Back
            </button>
          </div>

          {/* Fun Illustration */}
          <div className="mt-12">
            <div className="text-6xl mb-4">🤔</div>
            <p className="text-gray-500 italic">
              "Not all who wander are lost, but this page definitely is!"
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default NotFound