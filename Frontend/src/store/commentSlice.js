import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { commentService } from '../appwrite/comment'

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async (postId) => {
        const response = await commentService.getCommentsByPostId(postId);
        return { postId, comments: response.documents };
    }
);

export const addComment = createAsyncThunk(
    'comments/addComment',
    async ({ postId, content, userId, userName, userEmail }) => {
        const response = await commentService.createComment(postId, content, userId, userName, userEmail);
        return response;
    }
);

export const deleteComment = createAsyncThunk(
    'comments/deleteComment',
    async (commentId) => {
        await commentService.deleteComment(commentId);
        return commentId;
    }
);

export const updateComment = createAsyncThunk(
    'comments/updateComment',
    async({ commentId, content}) => {
        const updated = await commentService.updateComment(commentId, content);
        return updated;
    }
)


const commentSlice = createSlice({
    name: 'comments',
    initialState: {
        byPostId: {},
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.loading = false;
                const { postId, comments } = action.payload;
                state.byPostId[postId] = comments;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                const comment = action.payload;
                const postId = comment.postId;
                if (state.byPostId[postId]) {
                    state.byPostId[postId].unshift(comment);
                }
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                const commentId = action.payload;
                Object.keys(state.byPostId).forEach(postId => {
                    state.byPostId[postId] = state.byPostId[postId].filter(
                        comment => comment.$id !== commentId
                    );
                })
            })
            .addCase(updateComment.fulfilled, (state, action) => {
                const updatedComment = action.payload;
                for (const postId in state.byPostId) {
                    const index = state.byPostId[postId].findIndex(
                        (comment) => comment.$id === updatedComment.$id
                    );
                    if (index !== -1) {
                        state.byPostId[postId][index] = updatedComment;
                        break; 
                    }
                }
            })
    }
});

export default commentSlice.reducer;