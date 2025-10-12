import React, { useState, useEffect, useRef } from 'react'
import { Container, Logo } from '../index'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // useEffect(() => {
  //   console.log("Header rendered, userData:", userData)
  // }, [userData])

  // Reset dropdown state when auth status changes
  useEffect(() => {
    setDropdownOpen(false)
  }, [authStatus, userData])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [dropdownOpen])

  const navItems = [
    { name: 'Home', slug: '/', active: true },
    { name: 'Login', slug: '/login', active: !authStatus },
    { name: 'Signup', slug: '/signup', active: !authStatus },
    { name: 'All Posts', slug: '/all-posts', active: authStatus },
    { name: 'Add Post', slug: '/add-post', active: authStatus },
  ]

  const handleLogout = () => {
    authService.logout().then(() => {
      dispatch(logout())
      navigate('/')
    })
  }

  return (
    <header className="pt-3 pb-2 px-0.8 shadow-lg shadow-blue-100/60">
      <Container className = "rounded-xl">
        <nav className="flex items-center">
          <div className="mr-4">
            <Link to="/">
              <Logo width="50px" />
            </Link>
          </div>
          <ul className="flex ml-auto items-center gap-2">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`inline-block px-4 py-2 duration-200 rounded-full transition-all ${
                      location.pathname === item.slug
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50 ring-2 ring-blue-300 ring-opacity-50 transform scale-105'
                        : 'hover:bg-blue-100 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}

            {authStatus && userData && (
              <li className="relative" ref={dropdownRef}>
                <button
                  key={userData?.name}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold"
                >
                  {userData.name?.charAt(0).toUpperCase() || 'U'}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-md z-10">
                    <div className="p-3 border-b">
                      <div className="font-semibold">{userData.name}</div>
                      <div className="text-sm text-gray-600">{userData.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/dashboard')
                        setDropdownOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header
