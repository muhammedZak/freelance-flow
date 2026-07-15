import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import activitiesService from './activitiesService';

const initialState = {
  activities: [],
  loading: false,
  error: null,
};

export const fetchActivities = createAsyncThunk(
  'activities/fetchActivities',
  async (_, thunkAPI) => {
    try {
      return await activitiesService.getActivities();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default activitiesSlice.reducer;
