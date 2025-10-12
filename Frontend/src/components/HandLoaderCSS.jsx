import React from 'react';
import './HandLoader.css';
import img from '../assets/backg.jpg';

const HandLoaderCSS = ({ size = 'medium', text = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    small: 'hand-small',
    medium: 'hand-medium', 
    large: 'hand-large',
    xl: 'hand-xl'
  }

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8'

  return (
    <div 
      className={containerClasses}
      style={fullScreen ? {
        backgroundImage: `url(${img})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center'
      } : {}}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Hand Tapping Animation */}
        <div className={`hand-wrapper ${sizeClasses[size]}`}>
          <div className="hand-container">
            <div className="finger finger-1"></div>
            <div className="finger finger-2"></div>
            <div className="finger finger-3"></div>
            <div className="finger finger-4"></div>
            <div className="palm"></div>
            <div className="thumb"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center mt-14">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg border border-white/20">
            <p className="text-gray-700 font-medium animate-pulse text-lg">{text}</p>
            <div className="flex space-x-1 mt-3 justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HandLoaderCSS
