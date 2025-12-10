// src/redux/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  studentId: "",
  courses: "",
  userAvatar: "",
  userCover: "",
  bio: "",
  orderConnect: [],
  gender: "",
  major: "",
  userName: "",
  following: [],
  follower: [],
  friendsHidden: [],
  isAdmin: false,
  isTeacher: true,
  privacyPost: "",
  status: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    updateUser: {
      reducer(state, action) {
        Object.assign(state, action.payload);
      },
      prepare(user) {
        return {
          payload: {
            ...user,
            id: user._id,
            following: user.following || [],
            follower: user.follower || [],
          },
        };
      },
    },

    updateFollowingList: (state, action) => {
      const { friendId, isFollowing } = action.payload;

      state.following = isFollowing
        ? Array.from(new Set([...state.following, friendId]))
        : state.following.filter((id) => id !== friendId);
    },

    resetUser: () => initialState,
  },
});

export const { updateUser, resetUser, updateFollowingList } = userSlice.actions;
export default userSlice.reducer;
