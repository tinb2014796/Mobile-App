import { createSlice } from '@reduxjs/toolkit';


interface AttendanceState {
  loading: boolean;
  error: string | null;
  attendance: {
    id?: number;
    staff_id?: number;
    date?: string;
    time_start?: string;
    time_end?: string;
    reason?: string;
  } | null;
}

const initialState: AttendanceState = {
  loading: false,
  error: null,
  attendance: null
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setAttendance: (state, action) => {
      state.attendance = action.payload;
    },
    clearAttendance: (state) => {
      state.attendance = null;
      state.error = null;
    }
  }
});

export const { setLoading, setError, setAttendance, clearAttendance } = attendanceSlice.actions;

export default attendanceSlice.reducer;
