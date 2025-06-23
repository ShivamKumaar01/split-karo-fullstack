import { configureStore } from '@reduxjs/toolkit';
import signupReducer from './signupSlice';
import authReducer from './signupSlice';
import loginReducer from './loginSlice'
import userReducer from './groupSlice';

export const store = configureStore({
  reducer: {
    
    auth: authReducer,
    login: loginReducer,
    user: userReducer,
    
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;