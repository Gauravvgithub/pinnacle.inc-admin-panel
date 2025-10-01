
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import authSlice from './authSlice';
import userSlice from './userSlice';
import blogSlice from './blogSlice';
import seoSlice from './seoSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    auth: authSlice,
    user: userSlice,
    blog: blogSlice,
    seo: seoSlice,
});


export const store = configureStore({
    reducer: rootReducer,
});

export default store;

export type IRootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
