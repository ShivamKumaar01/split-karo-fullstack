
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Group {
  id: number;
  title: string;
  description: string;
  createdat: string;
}

interface GroupState {
  groups: Group[];
  totalGroups: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: GroupState = {
  groups: [],
  totalGroups: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
};


export const fetchGroupsByUserId = createAsyncThunk(
  'groups/fetchByUserId',
  async (
    {
      userId,
      page,
      limit,
    }: { userId: number; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/user/${userId}/groups?page=${page || 1}&limit=${limit || 5}`,
        { withCredentials: true } 
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch groups');
    }
  }
);

const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload.groups;
        state.totalGroups = action.payload.totalGroups;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchGroupsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default groupSlice.reducer;
