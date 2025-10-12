import React, {useEffect, useState} from 'react'
import { Container, PostCard } from '../index'
import { Link } from 'react-router-dom' // Make sure to import Link
import appwriteService from '../../appwrite/config'
import { useSelector } from 'react-redux'

function Home() {
    const [posts, setPosts] = useState([])
    const authStatus = useSelector((state) => state.auth.status)

    useEffect(() => {
        if (authStatus) {
            // appwriteService.getPosts([]).then((posts) => {
            //     if (posts) {
            //         setPosts(posts.documents)
            //     }
            // })
            appwriteService.getPosts().then((posts)=>{
                if(posts){
                    setPosts(posts.documents.filter(p=> p.status === 'active'));
                }
            })
        } else {
            setPosts([]) 
        }
    }, [authStatus])

    if (posts.length === 0) {
        return (
            <div className="w-full py-12 mt-8">
                <Container>
                    <div className="flex flex-wrap justify-center">
                        <div className="p-4 w-full max-w-2xl">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-white/20">
                                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                                    Welcome to BlogSphere
                                </h1>
                                <p className="text-lg text-gray-600 mb-6">
                                    Discover amazing stories and insights from our community
                                </p>
                                
                                
                                <Link 
                                    to="/login"
                                    className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                                >
                                    Login to read posts
                                </Link>
                                
                                
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    
    return (
        <div className='w-full py-8'>
            <Container>
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
                        Latest Posts
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
                </div>
                <div className='flex flex-wrap -m-3'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-3 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4'>
                            <div className="transform hover:scale-105 transition-all duration-300">
                                <PostCard {...post} />
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home