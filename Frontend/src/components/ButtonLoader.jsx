import React from 'react'

const ButtonLoader = ({ loading, children, className = '', ...props }) => {
  return (
    <button 
      className={`relative ${className} ${loading ? 'cursor-not-allowed opacity-75' : ''}`}
      disabled={loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  )
}

export default ButtonLoader
