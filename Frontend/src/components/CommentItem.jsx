import React, {useState} from 'react';
import { useSelector } from 'react-redux'

function CommentItem({ comment, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    const formatDate = (dateString) =>{
        return new Date(dateString).toLocaleDateString('en-us',{
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const {userData} = useSelector((state) => state.auth)
    const isOwner = userData && comment.userId === userData.$id;
    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    return (
       <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
                <div className="flex items-center space-x-2 flex-1">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {comment.userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{comment.userName}</span>
                </div>
                
                <div className="flex items-center space-x-2 pr-0.2">
                    <span className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                    </span>
                    
                    {isOwner && (
                        <div className="flex items-center space-x-1 ml-2">
                            <button onClick={() => setIsEditing(!isEditing)}
                                className="text-blue-500 hover:text-blue-700 pr-2"
                                title="Edit comment"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </button>
                            <button onClick={() => onDelete(comment.$id)}
                                className="text-red-500 hover:text-red-700"
                                title="Delete comment"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {isEditing ? (
                <div className ="ml-10">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md resize-none"
                        rows="3"
                        maxLength={500}
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                        <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onUpdate({commentId: comment.$id, content: editContent});
                                setIsEditing(false);
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            disabled={!editContent.trim()}
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (<p className="text-gray-700 ml-10">{comment.content}</p>)}
            
        </div>
    );
}
export default CommentItem;