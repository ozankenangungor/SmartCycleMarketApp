import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from './auth'
import listingReducer from './listings'
import conversationReducer from './conversation'
import chatsReducer from './chats'

const reducers = combineReducers({
    auth: authReducer,
    listing: listingReducer,
    conversation: conversationReducer,
    chats: chatsReducer
})

const store = configureStore({
    reducer: reducers
})



export type RootState = ReturnType<typeof store.getState>


export default store


