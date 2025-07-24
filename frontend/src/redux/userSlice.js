// import { createSlice } from '@reduxjs/toolkit';

// const userSlice = createSlice({
//   name: 'user',
//   initialState: {
//     user: null,
//     otherUsers: [],
//     profile: null,
//   },
//   reducers: {
//     getUser: (state, action) => {
//       state.user = action.payload;
//     },
//     getOtherUsers: (state, action) => {
//       state.otherUsers = action.payload;
//     },
//     getProfile: (state, action) => {
//       state.profile = action.payload;
//     },
//     getfollowingUpdate: (state, action) => {
//       if (state.user.following.includes(action.payload)) {
//         state.user.following = state.user.following.filter((itemId) => {
//           return itemId !== action.payload;
//         });
//       } else {
//         state.user.following.push(action.payload);
//       }
//     },
//   },
// });

// export const { getUser, getOtherUsers, getProfile, getfollowingUpdate } =
//   userSlice.actions;
// export default userSlice.reducer;

// new 
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    otherUsers: [],
    profile: null,
    notifications: [],
  },
  reducers: {
    getUser: (state, action) => {
      state.user = action.payload;
    },
    getOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    getProfile: (state, action) => {
      state.profile = action.payload;
    },
    getNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    getfollowingUpdate: (state, action) => {
      if (state.user.following.includes(action.payload)) {
        state.user.following = state.user.following.filter((itemId) => itemId !== action.payload);
      } else {
        state.user.following.push(action.payload);
      }
    },
  },
});

export const { getUser, getOtherUsers, getProfile, getNotifications, getfollowingUpdate } = userSlice.actions;
export default userSlice.reducer;