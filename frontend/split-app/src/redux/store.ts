import { configureStore } from '@reduxjs/toolkit';
import signupReducer from './signupSlice';
import authReducer from './signupSlice';
import loginReducer from './loginSlice'
import userReducer from './groupSlice';
import groupReducer from './createGroupSlice';
import groupsReducer from './useringroupSlice';
import groupExpenseReducer from './groupExpenseSlice'

export const store = configureStore({
  reducer: {
    
    auth: authReducer,
    login: loginReducer,
    user: userReducer,
    group: groupReducer,
     groups: groupsReducer,
      groupExpense: groupExpenseReducer,
    
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;