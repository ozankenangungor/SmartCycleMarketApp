import asyncStorage, { Keys } from "@utils/asyncStorage";
import client, { baseURL } from "app/api/client";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { TokenResponse } from "app/hooks/useClient";
import { Profile, updateAuthState } from "app/store/auth";
import { updateChatViewed, updateConversation } from "app/store/conversation";
import { Dispatch, UnknownAction } from "redux";
import { io } from "socket.io-client";

const socket = io(baseURL, {path: '/socket-message', autoConnect: false})

export const handleSocketConnection = (profile: Profile, dispatch: Dispatch<UnknownAction>) => {
    socket.auth = { token: profile.accessToken };
    socket.connect(); 

    socket.on("chat:message", (data: NewMessageResponse) => { 
        // this will update on going conversation or messages in between two users
        const {conversationId, from, message}  = data
        dispatch(updateConversation({conversationId: data.conversationId, chat: data.message, peerProfile: data.from})
    )})

    socket.on("chat:seen", (seenData: SeenData) => {
        dispatch(updateChatViewed({conversationId: seenData.conversationId, messageId: seenData.messageId}))
    })

    socket.on("connect_error", async (error) => {
        if(error.message === 'jwt expired') {
           const refreshToken = await asyncStorage.get(Keys.REFRESH_TOKEN)
           const response = await runAxiosAsync<TokenResponse>(client.post(`${baseURL}/auth/refresh-token`, {refreshToken}))
        if(response)
            await asyncStorage.save(Keys.AUTH_TOKEN, response.tokens.access)
            await asyncStorage.save(Keys.REFRESH_TOKEN, response!.tokens.refresh)
            dispatch(updateAuthState({profile: {...profile, accessToken: response!.tokens.access}, pending: false}))
            socket.auth = {token: response?.tokens.access}
            socket.connect()

        }
    });

}
export default socket


 type MessageProfile = {
    id: string;
    name: string;
    avatar?: string;
}

export type NewMessageResponse = {
    message: {
        id: string;
        time: string;
        text: string;
        user: MessageProfile;
        viewed: boolean;
    };
    from: MessageProfile;
    conversationId: string
}

type SeenData = {
    messageId: string;
    conversationId: string;
  }