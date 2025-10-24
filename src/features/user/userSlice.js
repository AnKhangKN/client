import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  isAdmin: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { _id, firstName, lastName, email, isAdmin } = action.payload;

      state.id = _id;
      state.firstName = firstName;
      state.lastName = lastName;
      state.email = email;
      state.isAdmin = isAdmin;
    },

    resetUser: (state) => {
      (state.id = ""),
        (state.firstName = ""),
        (state.lastName = ""),
        (state.email = ""),
        (state.isAdmin = false);
    },
  },
});

export const { updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
