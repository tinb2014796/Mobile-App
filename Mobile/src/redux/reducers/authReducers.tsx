import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
    id: string;
    access_token: string;
    user: {
        id: string;
        name: string;
        username: string;
        email: string;
        role: string;
    };
}

const initialState: AuthState = {
    id: '',
    access_token: '',
    user: {
        id: '',
        name: '',
        username: '',
        email: '',
        role: '',
    },
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authLogin: (state, action) => {
            return { ...state, ...action.payload };
        },
        authLogout: () => {
            return initialState;
        },
    },
});

export const selectAuth = (state: { auth: AuthState }) => state.auth;

export const { authLogin, authLogout } = authSlice.actions;

export default authSlice.reducer;
