import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../../appwrite/config";
import { Button, Container, HandLoaderCSS } from "../index";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import CommentSection from '../commentSection';

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
        <div className="py-4 md:py-8 px-4 md:px-0">
            <div className="w-full flex flex-col items-center mb-4 relative">
                <img
                    src={appwriteService.getFilePreview(post.featuredImage)}
                    alt={post.title}
                    className="rounded-xl max-h-[300px] md:max-h-[400px] object-cover w-full"
                />
                {isAuthor && (
                    <div className="absolute top-4 right-4 flex gap-2">
                        <Link to={`/edit-post/${post.$id}`}>
                            <Button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                            </Button>
                        </Link>
                        <Button 
                            onClick={deletePost}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                        </Button>
                    </div>
                )}
            </div>
            <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
                <h1 className="text-2xl md:text-4xl font-bold mb-4">{post.title}</h1>
                {parse(post.content)}
            </div>
            <CommentSection postId ={post.$id} />
        </div>
    ) : null;
}