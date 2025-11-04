// onlineFriendsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineFriends: [], // danh sách mutual friends online
};

export const onlineFriendsSlice = createSlice({
  name: "online",
  initialState,
  reducers: {
    updateOnlineFriends: (state, action) => {
      const { onlineFriends } = action.payload;
      state.onlineFriends = onlineFriends || [];
    },
    removeOnlineFriend: (state, action) => {
      const userId = action.payload.userId;
      state.onlineFriends = state.onlineFriends.filter((f) => f._id !== userId);
    },
  },
});

export const { updateOnlineFriends, removeOnlineFriend } =
  onlineFriendsSlice.actions;
export default onlineFriendsSlice.reducer;
