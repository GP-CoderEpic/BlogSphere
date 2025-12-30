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
        <form onSubmit={handleSubmit} className="mb-4 md:mb-6">
            <textarea
                value={content}
                onChange= {(e) => setContent(e.target.value)}
                placeholder= "Write a comment..."
                maxLength={1500}
                rows={3}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                <span className="text-xs sm:text-sm text-gray-500">
                    {content.length}/1500 characters
                </span>
                <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
                >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
            </div>
        </form>
    );
}

export default CommentForm;