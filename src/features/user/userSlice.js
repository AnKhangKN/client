// src/redux/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  userName: "",
  userAvatar: "",
  privacyPost: "",
  following: [],
  follower: [],
  bio: "",
  isAdmin: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const {
        _id,
        firstName,
        lastName,
        email,
        userName,
        userAvatar,
        privacyPost,
        following,
        follower,
        bio,
        isAdmin,
      } = action.payload;

      state.id = _id;
      state.firstName = firstName;
      state.lastName = lastName;
      state.email = email;
      state.userName = userName;
      state.userAvatar = userAvatar;
      state.privacyPost = privacyPost;
      state.following = following || [];
      state.follower = follower || [];
      state.bio = bio;
      state.isAdmin = isAdmin;
    },

    updateFollowingList: (state, action) => {
      const { friendId, isFollowing } = action.payload;
      if (isFollowing) {
        // thêm nếu chưa có
        if (!state.following.includes(friendId)) {
          state.following.push(friendId);
        }
      } else {
        // bỏ theo dõi
        state.following = state.following.filter((id) => id !== friendId);
      }
    },

    resetUser: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { updateUser, resetUser, updateFollowingList } = userSlice.actions;
export default userSlice.reducer;
