import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  user: null,
  otherUsers: [],
  profile: null,
  notifications: [],
};

// Create user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set current user data
    getUser: (state, action) => {
      state.user = action.payload;
    },
    // Set list of other users
    getOtherUsers: (state, action) => {
      state.otherUsers = action.payload || [];
    },
    // Set profile data for viewed user
    getProfile: (state, action) => {
      state.profile = action.payload;
    },
    // Set notifications
    getNotifications: (state, action) => {
      state.notifications = action.payload || [];
    },
    // Toggle following status for a user
    getToggleFollowing: (state, action) => {
      const userId = action.payload;
      if (state.user && Array.isArray(state.user.following)) {
        state.user.following = state.user.following.includes(userId)
          ? state.user.following.filter((id) => id !== userId)
          : [...state.user.following, userId];
      }
    },
    // Refresh user data
    getRefreshUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

// Export actions and reducer
export const {
  getUser,
  getOtherUsers,
  getProfile,
  getNotifications,
  getToggleFollowing,
  getRefreshUser,
} = userSlice.actions;
export default userSlice.reducer;