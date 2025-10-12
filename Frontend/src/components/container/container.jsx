import React from 'react'

function Container({children, className}) {
  return (
    <div className={`w-fullmax-w-7xl mx-auto px-4 bg-white/50 p-2 ${className}`}>
      {children}
    </div>
  )
}

export default Container
