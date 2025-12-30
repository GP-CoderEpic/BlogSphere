import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../../appwrite/config";
import { Button, Container, HandLoaderCSS } from "../index";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import CommentSection from '../CommentSection';

export default function Post() {
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post);
                } else {
                    navigate("/");
                }
                setIsLoading(false);
            }).catch(() => {
                setIsLoading(false);
                navigate("/");
            });
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen py-8">
                <Container>
                    <HandLoaderCSS text="Loading post..." size="large" />
                </Container>
            </div>
        );
    }

    return post ? (
        <div className="min-h-screen py-4 md:py-8 px-2 sm:px-4 md:px-6" style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFFFE0 100%)'
        }}>
            <div className="max-w-7xl mx-auto backdrop-blur-lg bg-white/10 rounded-xl md:rounded-3xl shadow-2xl p-3 sm:p-6 md:p-8 border border-white/30">
                <div className="w-full flex flex-col items-center mb-4 md:mb-8 relative">
                    <img
                        src={appwriteService.getFileView(post.featuredImage)}
                        alt={post.title}
                        className="rounded-lg md:rounded-2xl max-h-[200px] sm:max-h-[300px] md:max-h-[400px] object-cover w-full shadow-xl"
                    />
                    {isAuthor && (
                        <div className="absolute top-2 right-2 md:top-4 md:right-4 flex flex-col sm:flex-row gap-2 md:gap-3">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button className="backdrop-blur-md bg-green-400/30 hover:bg-green-400/50 text-white px-3 py-2 md:px-6 md:py-2.5 rounded-lg md:rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-1 md:gap-2 border border-white/40 text-sm md:text-base">
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span className="hidden sm:inline">Edit</span>
                                </Button>
                            </Link>
                            <Button 
                                onClick={deletePost}
                                className="backdrop-blur-md bg-red-400/30 hover:bg-red-400/50 text-white px-3 py-2 md:px-6 md:py-2.5 rounded-lg md:rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-1 md:gap-2 border border-white/40 text-sm md:text-base"
                            >
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span className="hidden sm:inline">Delete</span>
                            </Button>
                        </div>
                    )}
                </div>
                <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none backdrop-blur-md bg-white/20 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-inner border border-white/30">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-900 break-words">{post.title}</h1>
                    <div className="text-gray-800 break-words">
                        {parse(post.content)}
                    </div>
                </div>
                <div className="mt-4 md:mt-8 backdrop-blur-md bg-white/20 p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/30">
                    <CommentSection postId={post.$id} />
                </div>
            </div>
        </div>
    ) : null;
}