import React, { useState, useEffect } from 'react'
import HandLoaderCSS from './HandLoaderCSS'

const PageLoader = ({ children, minLoadingTime = 4000 }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, minLoadingTime)

    return () => clearTimeout(timer)
  }, [minLoadingTime])

  return (
    <div className="relative">
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-50">
          <HandLoaderCSS 
            fullScreen={true} 
            size="xl" 
            text="Welcome to BlogSphere" 
          />
        </div>
      )}
      
      {/* Main Content */}
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </div>
  )
}

export default PageLoader
