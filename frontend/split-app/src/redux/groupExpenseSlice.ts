
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchGroupTotalExpense = createAsyncThunk(
  'groupExpense/fetchTotal',
  async (groupId: number, thunkAPI) => {
    try {
      const res = await axios.get(`http://localhost:8080/expense/group/${groupId}/total`);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data || 'Something went wrong');
    }
  }
);

interface GroupExpenseState {
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: GroupExpenseState = {
  total: 0,
  loading: false,
  error: null,
};

const groupExpenseSlice = createSlice({
  name: 'groupExpense',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupTotalExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupTotalExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.total = action.payload.totalExpense;
      })
      .addCase(fetchGroupTotalExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default groupExpenseSlice.reducer;
