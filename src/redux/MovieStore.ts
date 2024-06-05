import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './MovieSlice';
import userReducer from './UserSlice';

const store = configureStore({
    reducer: {
        movies: movieReducer,
        user: userReducer,
    }
});

export default store; 

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

