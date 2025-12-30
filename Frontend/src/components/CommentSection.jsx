import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchComments, addComment, deleteComment, updateComment } from '../store/commentSlice';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

function CommentSection({ postId }) {
    const dispatch = useDispatch();
    const { byPostId, loading, error } = useSelector((state) => state.comments);
    const { userData } = useSelector((state) => state.auth);

    const comments = byPostId[postId] || [];

    useEffect(() => {
        dispatch(fetchComments(postId));
    }, [dispatch, postId]);

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            await dispatch(deleteComment(commentId));
        }
    };

    const handleUpdateComment = async ({ commentId, content }) => {
        if (!userData) return;
        const comment = comments.find(c => c.$id === commentId);
        if (comment && comment.userId === userData.$id) {
            await dispatch(updateComment({ commentId, content }));
        }
    };


    const handleAddComment = async (content) => {
        if(userData) {
            await dispatch(addComment({
                postId,
                content,
                userId: userData.$id,
                userName: userData.name,
                userEmail: userData.email,
            }));
        }
    };

    return (
        <div className="mt-2 md:mt-4">
            <h3 className="text-lg sm:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Comments ({comments.length})
            </h3>

            {userData && (
                <CommentForm onSubmit={handleAddComment} />
            )}

            {loading ? (
                <div className="text-center py-4 text-gray-600">Loading comments...</div>
            ) : comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No comments yet. Be the first to comment!</p>
                </div>
            ) : (
                <div className="space-y-3 md:space-y-4">
                    {comments.map(comment => (
                        <CommentItem key={comment.$id} comment={comment} onDelete={handleDeleteComment} onUpdate={handleUpdateComment} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default CommentSection;