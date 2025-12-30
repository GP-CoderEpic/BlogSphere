import React, { useEffect, useState } from 'react'
import { Container, PostCard } from '../index'
import appwriteService from '../../appwrite/config'
import { useSelector } from 'react-redux'
import HandLoaderCSS from '../HandLoaderCSS'

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const authStatus = useSelector((state) => state.auth.status)

    useEffect(() => {
        setIsLoading(true)
        if (authStatus) {
            appwriteService.getPosts().then((posts) => {
                if (posts) {
                    setPosts(posts.documents)
                }
                setIsLoading(false)
            }).catch(() => {
                setIsLoading(false)
            })
        } else {
            setPosts([])
            setIsLoading(false)
        }
    }, [authStatus])

  return (
    <div className='w-full py-8'>
        <Container>
            {isLoading ? (
                <HandLoaderCSS text="Loading posts..." size="large" />
            ) : (
                <div className='flex flex-wrap gap-6'>
                    {posts.map((post) => (
                        <div key={post.$id} className='w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            )}
        </Container>
    </div>
  )
}

export default AllPosts
