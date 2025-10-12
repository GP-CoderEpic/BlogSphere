import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice';
import commentSlice from './commentSlice';

const store = configureStore({
    reducer: { 
        auth : authSlice,
        comments: commentSlice,
    }
});

export default store;