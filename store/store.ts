import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from "store/auth/authSlice"
import postReducer from "store/post/postSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer, //Sliceのselectの部分のところと一致させる
    post: postReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export type AppDispatch = typeof store.dispatch;
