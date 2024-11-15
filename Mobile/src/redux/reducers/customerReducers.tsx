import { createSlice } from '@reduxjs/toolkit';

interface CustomerState {
  isAuthenticated: boolean;
  customer: any;
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  isAuthenticated: false,
  customer: null,
  loading: false,
  error: null
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    customerLoginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    customerLoginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.customer = action.payload;
      state.error = null;
    },
    customerLoginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.customer = null;
      state.error = action.payload;
    },
    customerLogout: (state) => {
      state.isAuthenticated = false;
      state.customer = null;
      state.loading = false;
      state.error = null;
    }
  }
});

export const {
  customerLoginRequest,
  customerLoginSuccess, 
  customerLoginFailure,
  customerLogout
} = customerSlice.actions;

export default customerSlice.reducer;
