import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

export interface ActiveChat {
    id: string;
    lastMessage: string;
    timestamp: string;
    unreadChatCounts: number;
    peerProfile: {
        id: string;
        name: string;
        avatar?: string;
    }
  }

  const initialState: ActiveChat[] = []
  
const slice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        addNewActiveChats(state, {payload}: PayloadAction<ActiveChat[]>) {
            return payload
        },
        removeUnreadChatCount(state, {payload}: PayloadAction<string>) {
            const index = state.findIndex(chat => chat.id === payload)

            if(index !== -1) {
                state[index].unreadChatCounts = 0
        }
    }
}})

export const {addNewActiveChats, removeUnreadChatCount} = slice.actions

export const getActiveChats = createSelector((state: RootState) => state, (state) => state.chats)

export const getUnreadChatsCount = createSelector((state: RootState) => state, (state) =>
     state.chats.reduce((acc, chat) => acc + chat.unreadChatCounts, 0))

export default slice.reducer