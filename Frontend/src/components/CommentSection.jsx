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
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">
                Comments ({comments.length})
            </h3>

            {userData && (
                <CommentForm onSubmit={handleAddComment} />
            )}

            {loading ? (
                <div> Loading comments...</div>
            ) : (
                <div className="space-y-4">
                    {comments.map(comment => (
                        <CommentItem key={comment.$id} comment={comment} onDelete={handleDeleteComment} onUpdate={handleUpdateComment} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default CommentSection;