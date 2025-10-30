import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import userSlice from "../features/user/userSlice";
import themeReducer from "../features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userSlice,
    theme: themeReducer,
  },
});
