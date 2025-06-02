import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 👇 Define the user type (customize based on your actual user structure)
interface User {
  id: string;
  name: string;
  // Add more fields as needed
}

// 👇 Define the state type
interface UserInfoState {
  user: User[];
}

const initialState: UserInfoState = {
  user: [],
};

const UserInfo = createSlice({
  name: "userinfo",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.user.push(action.payload);
    },
    clearUser: (state) => {
      state.user = [];
    },
  },
});

export const { addUser, clearUser } = UserInfo.actions;

export default UserInfo.reducer;
