

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Group {
  id: number;
  title: string;
  description: string;
//   createdBy: number;
}

interface GroupState {
  groups: Group[];
  loading: boolean;
  error: string | null;
}

const initialState: GroupState = {
  groups: [],
  loading: false,
  error: null,
};

export const createGroup = createAsyncThunk(
  "group/createGroup",
  async (
    groupData: { title: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return rejectWithValue("Token not found");

      const res = await fetch("http://localhost:8080/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
         credentials: "include",
        body: JSON.stringify(groupData), 
      });

      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message || "Failed to create group");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue("Something went wrong while creating group");
    }
  }
);


const createGroupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups.push(action.payload); 
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default createGroupSlice.reducer;

