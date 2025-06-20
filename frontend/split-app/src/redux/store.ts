import { configureStore } from '@reduxjs/toolkit';
import signupReducer from './signupSlice';
import authReducer from './signupSlice';
import loginReducer from './loginSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    login: loginReducer,
    // signup:signupReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;