# Frontend-Backend Integration Guide

## 🔗 Running Both Servers

### 1. Start Backend (Terminal 1)
```bash
cd Backend
npm start
# Server runs on http://localhost:5000
```

### 2. Start Frontend (Terminal 2)
```bash
cd Frontend  
npm run dev
# Frontend runs on http://localhost:5173
```

## 🔧 API Integration Usage

### Import the API Service
```javascript
import apiService from '../services/api.js';
```

### Authentication Examples

#### Register User
```javascript
const handleRegister = async (formData) => {
  try {
    const response = await apiService.register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    console.log('User registered:', response.user);
    // Redirect to login or dashboard
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
};
```

#### Login User
```javascript
const handleLogin = async (formData) => {
  try {
    const response = await apiService.login({
      email: formData.email,
      password: formData.password
    });
    console.log('Login successful:', response.user);
    // Token is automatically stored in localStorage
    // Redirect to dashboard
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
```

#### Get User Profile
```javascript
const getUserProfile = async () => {
  try {
    const profile = await apiService.getProfile();
    console.log('User profile:', profile.user);
    return profile.user;
  } catch (error) {
    console.error('Failed to get profile:', error.message);
    // Redirect to login if token is invalid
  }
};
```

### Post Management Examples

#### Get All Posts
```javascript
const getAllPosts = async () => {
  try {
    const response = await apiService.getPosts(1, 10); // page 1, 10 posts
    console.log('Posts:', response.posts);
    return response.posts;
  } catch (error) {
    console.error('Failed to get posts:', error.message);
  }
};
```

#### Create Post with Image
```javascript
const handleCreatePost = async (postData, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('status', postData.status || 'active');
    
    if (imageFile) {
      formData.append('featuredImage', imageFile);
    }

    const response = await apiService.createPost(formData);
    console.log('Post created:', response.post);
    return response.post;
  } catch (error) {
    console.error('Failed to create post:', error.message);
  }
};
```

#### Display Image in React Component
```jsx
import apiService from '../services/api.js';

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <h2>{post.title}</h2>
      {post.featuredImage && (
        <img 
          src={apiService.getImageUrl(post.featuredImage)}
          alt={post.title}
          className="featured-image"
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
};
```

## 🛡️ Authentication State Management

### Using React Context or Redux
```javascript
// authContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const profile = await apiService.getProfile();
          setUser(profile.user);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid, clear it
          apiService.logout();
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await apiService.login(credentials);
    setUser(response.user);
    setIsAuthenticated(true);
    return response;
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## 🔄 Error Handling

### Global Error Handler
```javascript
// errorHandler.js
export const handleApiError = (error) => {
  if (error.message.includes('Authentication')) {
    // Redirect to login
    window.location.href = '/login';
  } else if (error.message.includes('Network')) {
    // Show network error message
    console.error('Network error - check if backend is running');
  } else {
    // Show generic error message
    console.error('An error occurred:', error.message);
  }
};
```

## 🖼️ Image Handling Best Practices

### Lazy Loading Images
```jsx
const LazyImage = ({ fileId, alt, className }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={`image-container ${className}`}>
      {loading && <div className="loading-placeholder">Loading...</div>}
      <img
        src={apiService.getImageUrl(fileId)}
        alt={alt}
        className={loading ? 'hidden' : 'block'}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
      {error && <div className="error-placeholder">Failed to load image</div>}
    </div>
  );
};
```

## 📱 Environment Configuration

### Development vs Production
```javascript
// config.js
const config = {
  development: {
    apiUrl: 'http://localhost:5000',
    appwriteUrl: import.meta.env.VITE_APPWRITE_URL,
  },
  production: {
    apiUrl: 'https://your-backend-domain.com',
    appwriteUrl: import.meta.env.VITE_APPWRITE_URL,
  }
};

const env = import.meta.env.NODE_ENV || 'development';
export default config[env];
```

## 🔍 Testing Integration

### Test API Connection
```javascript
// Add this to your main App component to test connection
useEffect(() => {
  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/health');
      const data = await response.json();
      console.log('Backend connection test:', data);
    } catch (error) {
      console.error('Backend connection failed:', error);
    }
  };

  testConnection();
}, []);
```

## 🚀 Both Servers Running Checklist

- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:5173  
- ✅ CORS configured (frontend can access backend)
- ✅ Environment variables set in both projects
- ✅ API service created for frontend
- ✅ Authentication flow implemented
- ✅ Image serving endpoints working

## 🎯 Next Steps

1. **Implement Authentication UI** - Login/Register forms
2. **Create Post Management UI** - CRUD operations
3. **Add Image Upload Components** - File upload with preview
4. **Implement Error Handling** - User-friendly error messages
5. **Add Loading States** - Better UX during API calls
6. **Test All Features** - Ensure everything works together
