import React, { useState, useEffect } from 'react'
import { Container, PostCard, HandLoaderCSS } from '../index'
import { useSelector, useDispatch } from 'react-redux'
import appwriteService from '../../appwrite/config'
import authService from '../../appwrite/auth'
import { login } from '../../store/authSlice'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const userData = useSelector((state) => state.auth.userData)
  const authStatus = useSelector((state) => state.auth.status)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [myPosts, setMyPosts] = useState([])
  const [inactivePosts, setInactivePosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState(userData?.name || '')
  const [updating, setUpdating] = useState(false)

  // Ensure redux auth status is set when we have userData (prevents protected-route redirect)
  useEffect(() => {
    if (userData && !authStatus) {
      dispatch(login({ userData }))
    }
  }, [userData, authStatus, dispatch])

  useEffect(() => {
    if (userData) {
      
      appwriteService.getPosts([]).then((posts) => {
        if (posts) {
          
          const userPosts = posts.documents.filter(post => post.userId === userData.$id && post.status === 'active')
          const inactive = posts.documents.filter(post => post.userId === userData.$id && post.status !== 'active')
          setInactivePosts(inactive)
          setMyPosts(userPosts)
        }
        setLoading(false)
      })
    }
  }, [userData])


  useEffect(() => {
    setNewName(userData?.name || '')
  }, [userData?.name])

  const handleNameUpdate = async () => {
    if (!newName.trim()) return
    
    setUpdating(true)
    try {
      
        await authService.updateName(newName)
        const freshUser = await authService.getCurrentUser()
        dispatch(login({userData: freshUser}))
      
        setEditingName(false)
    } catch (error) {
      console.error('Error updating name:', error)
      alert('Failed to update name. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await appwriteService.deletePost(postId)
        setMyPosts(myPosts.filter(post => post.$id !== postId))
        alert('Post deleted successfully!')
      } catch (error) {
        console.error('Error deleting post:', error)
        alert('Failed to delete post. Please try again.')
      }
    }
  }

  if (loading) {
    return (
      <div className="w-full py-8">
        <Container>
          <HandLoaderCSS text="Loading dashboard..." size="large" />
        </Container>
      </div>
    )
  }

  return (
    <div className="w-full py-8 min-h-screen">
      <Container>
        
        <div className="mb-8">
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl transition-all duration-300 hover:from-white/25 hover:to-white/15">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Dashboard
                </h1>
                <p className="text-gray-700 font-medium">Manage your profile and posts</p>
              </div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg ring-4 ring-blue-100">
                {userData?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Name
                </label>
                {editingName ? (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white/70 backdrop-blur-sm"
                      placeholder="Enter your name"
                    />
                    <button
                      onClick={handleNameUpdate}
                      disabled={updating}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                    >
                      {updating ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingName(false)
                        setNewName(userData?.name || '')
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl shadow-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-semibold text-gray-800 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                      {userData?.name || 'No name set'}
                    </span>
                    <button
                      onClick={() => setEditingName(true)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Email
                </label>
                <div className="text-xl font-semibold text-gray-800 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                  {userData?.email}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl transition-all duration-300 hover:from-white/25 hover:to-white/15">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Posts
              </h2>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold shadow-lg">
                {myPosts.length} {myPosts.length === 1 ? 'post' : 'posts'}
              </div>
            </div>

          {myPosts.length === 0 ? (
            <div className="bg-gradient-to-br from-white/30 to-white/20 backdrop-blur-md rounded-2xl shadow-xl p-12 text-center border-2 border-dashed border-white/30">
              <div className="text-gray-700 mb-6">
                <svg className="w-20 h-20 mx-auto mb-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-xl font-semibold text-gray-800 mb-2">No posts yet!</p>
                <p className="text-gray-600">Start sharing your thoughts with the world</p>
              </div>
              <button
                onClick={() => navigate('/add-post')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                ✨ Create Your First Post
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-8">
              {myPosts.map((post) => (
                <div key={post.$id} className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] xl:w-[calc(25%-24px)]">
                  <div className="relative group">
                    <div className="transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                      <PostCard {...post} />
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/edit-post/${post.$id}`)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.$id)}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Inactive Posts Section */}
          {inactivePosts.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Inactive Posts
                </h2>
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2 rounded-full font-bold shadow-lg">
                  {inactivePosts.length} {inactivePosts.length === 1 ? 'post' : 'posts'}
                </div>
              </div>
              
              <div className="bg-yellow-50/50 backdrop-blur-md rounded-xl p-4 mb-6">
                <p className="text-amber-700 text-sm">
                  These posts are not visible to users because they are pending approval or have been deactivated.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-8">
                {inactivePosts.map((post) => (
                  <div key={post.$id} className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] xl:w-[calc(25%-24px)]">
                    <div className="relative group opacity-70 hover:opacity-90 transition-opacity">
                      <div className="transform hover:scale-105 transition-all duration-300">
                        <PostCard {...post} />
                      </div>
                      {/* action buttons: keep on top so they remain clickable */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/edit-post/${post.$id}`)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 z-40"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.$id)}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 z-40"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                      {/* overlay badge - does not block pointer events so buttons stay clickable */}
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                        <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold pointer-events-none">
                          {post.status === 'inactive' ? 'Inactive' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          

          </div>
        </div>
      </Container>
    </div>
  )
}

export default Dashboard
