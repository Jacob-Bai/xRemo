import { configureStore } from '@reduxjs/toolkit';
import appReducer from '@/hooks/appSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

// Infer the `AppState` and `AppDispatch` types from the store itself
export type AppState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
// export const store = store;