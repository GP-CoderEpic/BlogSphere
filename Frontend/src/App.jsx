import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';  //when we use redux with react we need dispatch
import './App.css'
import authservice from './appwrite/auth';
import { login, logout } from './store/authSlice';
import { Header, Footer } from './components'; 
import { Outlet } from 'react-router-dom';
import PageLoader from './components/PageLoader';
import LoadingSpinner from './components/LoadingSpinner';
import img from './assets/backg.jpg'

function App() {
  const userData = useSelector((state) => state.auth.userData)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch();

  useEffect(() => {
    authservice.getCurrentUser()
      .then((userData) => {
        // console.log("getCurrentUser response:", userData);
        if(userData){
          dispatch(login({userData}))
        }else{
          dispatch(logout())
        }
      })
      .finally(() => {setLoading(false)})
  }, [])

  return (
    <PageLoader minLoadingTime={2000}>
      <div className='min-h-screen flex flex-col' style={{backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <Header key={userData?.$id || 'guest'} />
        <main className='flex-grow'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </PageLoader>
  )
}

export default App
