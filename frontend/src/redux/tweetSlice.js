import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  tweets: [],
  refresh: false,
  isActive: true,
};

// Create tweet slice
const tweetSlice = createSlice({
  name: 'tweet',
  initialState,
  reducers: {
    // Get all tweets
    getAllTweets: (state, action) => {
      state.tweets = action.payload || [];
    },
    // Toggle refresh state
    tweetRefresh: (state) => {
      state.refresh = !state.refresh;
    },
    // Set active status
    tweetIsActive: (state, action) => {
      state.isActive = !!action.payload;
    },
  },
});

// Export actions and reducer
export const { getAllTweets, tweetRefresh, setIsActive } = tweetSlice.actions;
export default tweetSlice.reducer;