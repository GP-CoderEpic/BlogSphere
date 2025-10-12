import React from 'react'
import appwriteService from '../appwrite/config'
import { Link } from 'react-router-dom'

function PostCard({$id, title, featuredImage}) {
  return (
    <Link to={`/post/${$id}`}>
      <div className='w-full bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 group'>
        <div className='w-full justify-center mb-4 overflow-hidden rounded-xl'>
          {featuredImage ? (
            <img
              src={appwriteService.getFileView(featuredImage)}
              alt={title}
              className='rounded-xl w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500'
            />
          ) : (
            <div className='w-full h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center'>
              <div className='text-white text-4xl font-bold opacity-70'>
                📝
              </div>
            </div>
          )}
        </div>
        <h2 className='text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2'>
          {title}
        </h2>
        <div className='mt-3 flex items-center text-sm text-gray-500'>
          <span className='bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-medium'>
            Read more →
          </span>
        </div>
      </div>
    </Link>
  )
}

export default PostCard