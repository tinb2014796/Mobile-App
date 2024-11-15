import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
    id: string;
    access_token: string;
    user: object;
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
    initialState:{
        authData: initialState,
    },
    reducers: {
        authLogin: (state, action) => {
            return { ...state, ...action.payload};
        },
        authLogout: () => {
            return {authData: initialState};
        },
    },
});

export const selectAuth = (state: { auth: AuthState }) => state.auth;

export const { authLogin, authLogout } = authSlice.actions;

export default authSlice.reducer;


