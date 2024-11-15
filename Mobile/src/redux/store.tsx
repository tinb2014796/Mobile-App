import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducers';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
