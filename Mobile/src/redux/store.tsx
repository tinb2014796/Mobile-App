import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/reducers/authReducers';
import customerReducer from '../redux/reducers/customerReducers';
import attendanceReducer from '../redux/reducers/attenceReducers';

const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    attendance: attendanceReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
