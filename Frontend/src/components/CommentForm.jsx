import react, { useState } from "react";

function CommentForm({ onSubmit }) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async(e) =>{
        e.preventDefault();
        if(content.trim() && !isSubmitting){
            setIsSubmitting(true);
            await onSubmit(content.trim());
            setContent('');
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <textarea
                value={content}
                onChange= {(e) => setContent(e.target.value)}
                placeholder= "Write a comment..."
                maxLength={1500}
                rows={3}
                className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                    {content.length}/1500 characters
                </span>
                <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
            </div>
        </form>
    );
}

export default CommentForm;