import { configureStore, combineReducers } from '@reduxjs/toolkit'
// import { persistStore } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
import taskReducer from '@/store/reducers/taskSlice'
import sessionReducer from '@/store/reducers/sessionSlice'

// Persist config for session state
// const sessionPersistConfig = {
//   key: 'session',
//   storage
// }

// Persist the session reducer only
// const persistedSessionReducer = persistReducer(sessionPersistConfig, sessionReducer)

// const rootReducer = combineReducers({
//   tasks: taskReducer,
//   session: persistedSessionReducer
// })

const rootReducer = combineReducers({
  tasks: taskReducer,
  session: sessionReducer
})

// Create store with default middleware
export const store = configureStore({
  reducer: rootReducer
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: false
  //   })
})

// export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
