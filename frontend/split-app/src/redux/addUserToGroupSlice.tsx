import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
export const addUsersToGroup = createAsyncThunk(
  'groupMember/addUsersToGroup',
  async ({ userIds, groupId }: { userIds: number[]; groupId: number }, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:8080/group-member', {
        userIds,
        groupId,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);
interface GroupMemberState {
  loading: boolean;
  error: string | null;
}

const initialState: GroupMemberState = {
  loading: false,
  error: null,
};

const groupMemberSlice = createSlice({
  name: 'groupMember',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addUsersToGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUsersToGroup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addUsersToGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default groupMemberSlice.reducer;
