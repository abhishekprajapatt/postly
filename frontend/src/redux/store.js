import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userSlice from './userSlice';
import tweetSlice from './tweetSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user'], // Only persist user slice
};

// Combine reducers
const rootReducer = combineReducers({
  user: userSlice,
  tweet: tweetSlice,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with optimized settings
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore specific paths for non-serializable values
        ignoredPaths: ['tweet.tweets'], // Adjust based on state shape
      },
    }),
  // Disable DevTools in production
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
