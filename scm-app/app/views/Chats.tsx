import { View, StyleSheet, Text, FlatList, Pressable } from 'react-native';
import { FC, useEffect } from 'react';
import AppHeader from '@components/AppHeader';
import BackButton from '@ui/BackButton';
import EmptyView from '@ui/EmptyView';
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import { useDispatch, useSelector } from 'react-redux';
import { ActiveChat, getActiveChats, removeUnreadChatCount } from 'app/store/chats';
import RecentChat, { Seperator } from '@components/RecentChat';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppStackParamList } from 'app/navigator/AppNavigator';

interface Props {}

const Chats: FC<Props> = (props) => {
  const {authClient} = useClient()
  const dispatch = useDispatch()
  const navigation = useNavigation<NavigationProp<AppStackParamList>>()



  const chats = useSelector(getActiveChats)

  const onChatPress = (chat: ActiveChat) => {
    // first we want to remove the unread chat counts
    dispatch(removeUnreadChatCount(chat.id))

    // we want to navigate our users to chat screen 
    navigation.navigate('ChatWindow', {conversationId: chat.id, peerProfile: chat.peerProfile})
  }


  if(!chats.length) {
    return(
      <>
        <AppHeader backButton={<BackButton/>}/>
        <EmptyView title='There is no chats!'/>
      </>
    ) 
   }
  return (
       <>
        <AppHeader backButton={<BackButton/>}/>
         <FlatList data={chats} renderItem={({item}) => {
        return(
          <Pressable onPress={() => onChatPress(item)}>
          <RecentChat name={item.peerProfile.name} avatar={item.peerProfile.avatar} timestamp={item.timestamp} lastMessage={item.lastMessage} unreadMessageCount={item.unreadChatCounts} />
          </Pressable>
        )
       }} contentContainerStyle={styles.container} ItemSeparatorComponent={()=><Seperator/>} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    
  }
});

export default Chats;

