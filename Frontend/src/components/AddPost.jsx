import React from 'react'
import { Container, PostForm } from '../index'

function AddPost() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 flex items-center justify-center">
      <Container>
        <div className="max-w-3xl mx-auto bg-white/90 rounded-2xl shadow-2xl p-8 border border-blue-100">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-8 drop-shadow">Add New Post</h2>
          <PostForm />
        </div>
      </Container>
    </div>
  )
}

export default AddPost
