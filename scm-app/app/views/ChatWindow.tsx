import { View, StyleSheet, Text } from 'react-native';
import { FC, useCallback, useEffect, useState } from 'react';
import AppHeader from '@components/AppHeader';
import BackButton from '@ui/BackButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from 'app/navigator/AppNavigator';
import AvatarView from '@ui/AvatarView';
import PeerProfile from '@ui/PeerProfile';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import useAuth from 'app/hooks/useAuth';
import EmptyChatContainer from '@ui/EmptyChatContainer';
import socket, { NewMessageResponse } from 'app/socket';
import { useDispatch, useSelector } from 'react-redux';
import { addConversation, Conversation, selectConversationById, updateConversation } from 'app/store/conversation';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import useClient from 'app/hooks/useClient';
import EmptyView from '@ui/EmptyView';
import { useFocusEffect } from '@react-navigation/native';


type Props = NativeStackScreenProps<AppStackParamList, 'ChatWindow'>

type OutGoingMessage = {
  message: {
    id: string;
    time: string;
    text: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
    }
  },
  to: string;
  conversationId: string;
}

const getTime = (value: Date | number) => {
  if(value instanceof Date) return value.toISOString();
  return new Date(value).toISOString()
}

const formatConversationToIMessage = (value?: Conversation): IMessage[] => {
  const formattedValues = value?.chats.map((chat) => {
    return {
      _id: chat.id,
      text: chat.text,
      createdAt: new Date(chat.time),
      received: chat.viewed,
      user: {
        _id: chat.user.id,
        name: chat.user.name,
        avatar: chat.user.avatar
      }
    }
  })
  // sort messages
  const messages = formattedValues || []
  return messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime() )
}

const ChatWindow: FC<Props> = ({route}) => {

  const {conversationId, peerProfile} = route.params
  const {authState} = useAuth()
  const dispatch = useDispatch()
  const chats = useSelector(selectConversationById(conversationId))
  const {authClient} = useClient()
  const [fetchingChats, setFetchingChats] = useState(false)
  

  const handleOnMessageSend = (messages: IMessage[]) => {
    if(!authState.profile) return;

    const currentMessage = messages[messages.length - 1]

    const newMessage : OutGoingMessage = {
      message: {
        id: currentMessage._id.toString(),
        text: currentMessage.text,
        time: getTime(currentMessage.createdAt),
        user: {
          id: authState.profile?.id,
          name: authState.profile.name,
          avatar: authState.profile.avatar
        }
      },
      conversationId: conversationId,
      to: peerProfile.id
    }

    // this will update our store and also update the UI
    dispatch(updateConversation({conversationId, chat: {...newMessage.message, viewed: false}, peerProfile}))

    // sending message to our api
    socket.emit("chat:new", newMessage)
    
  }

  const fetchOldChats = async () => {
    setFetchingChats(true)
    const res = await runAxiosAsync<{conversation: Conversation}>(authClient(`/conversation/chats/${conversationId}`))
    setFetchingChats(false)

    if(res?.conversation) dispatch(addConversation([res.conversation]));
  }
  
  const sendSeenRequest = () => {
    // 187.ders
  runAxiosAsync(authClient.patch(`/conversation/seen/${conversationId}/${peerProfile.id}`))
  }

  useEffect(() => {
    const handleApiRequest = async () => {

    await fetchOldChats()
    // we want to update viewed property inside our database
    await sendSeenRequest()
    }
    handleApiRequest()
  },[])
  

  useFocusEffect(
    useCallback(() => {
    const updateSeenStatus = (data : NewMessageResponse) => {
      socket.emit('chat:seen', {messageId: data.message.id, conversationId: data.conversationId, peerId: peerProfile.id})
    }

    socket.on('chat:message', updateSeenStatus)

    return () => socket.off('chat:message', updateSeenStatus)
  }, []))
  
  // _id typescript error fix
  if(!authState.profile) return null;

  if(fetchingChats) return <EmptyView title='Please Wait...'/>



  return (
    <View style={styles.container}>
     <AppHeader backButton={<BackButton/>} center={<PeerProfile name={peerProfile.name} avatar={peerProfile.avatar} />}/>

     <GiftedChat user={{ _id: authState.profile.id, name: authState.profile.name, avatar: authState.profile.avatar, }} 
                 messages={formatConversationToIMessage(chats)} 
                 onSend={handleOnMessageSend}
                renderChatEmpty={() => <EmptyChatContainer/>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

 
});

export default ChatWindow;