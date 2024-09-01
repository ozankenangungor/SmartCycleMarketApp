import {View,StyleSheet, Text, ScrollView, TextInput, Pressable, RefreshControl} from 'react-native'
import {FC, useEffect, useState} from 'react';
import AvatarView from '@ui/AvatarView';
import useAuth from 'app/hooks/useAuth';
import colors from '@utils/colors';
import FormDivider from '@ui/FormDivider';
import ProfileOptionListItem from '@components/ProfileOptionListItem';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileNavigatorParamList } from 'app/navigator/ProfileNavigator';
import {AntDesign} from '@expo/vector-icons'
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import { ProfileRes } from 'app/navigator';
import { useDispatch, useSelector } from 'react-redux';
import { updateAuthState } from 'app/store/auth';
import { showMessage } from 'react-native-flash-message';
import { selectImages } from '@utils/helper';
import mime from 'mime'
import LoadingSpinner from '@ui/LoadingSpinner';
import { getUnreadChatsCount } from 'app/store/chats';

interface Props {

 }


const Profile: FC<Props> = (props) => {
  const {authState, signOut} = useAuth()
  const [busy, setBusy] = useState(false)
  const [updatingAvatar, setUpdatingAvatar] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [userName, setUserName] = useState(authState.profile?.name || '')
  
  const isNameChanged = authState.profile?.name !== userName && userName.trim().length >= 3

  const navigation = useNavigation<NavigationProp<ProfileNavigatorParamList>>()

  const totalUnreadMessages = useSelector(getUnreadChatsCount)
  
  const {authClient} = useClient()
  const dispatch = useDispatch()

  const onMessagePress = () => navigation.navigate('Chats');
  const onListingPress = () => navigation.navigate('Listings');

  const updateProfile = async () => {
    const response = await runAxiosAsync<{profile: ProfileRes}>(authClient.patch('/auth/update-profile', {name: userName}))
    if(response) {
    dispatch(updateAuthState({pending: false, profile: {...authState.profile!, ...response.profile }}))
    showMessage({message: 'Name updated successfully', type: 'success'})
    }
    
  }

  const getVerificationLink = async () => {
    setBusy(true)
    const response = await runAxiosAsync<{message: string}>(authClient.get('/auth/verify-token'))
    setBusy(false)
    if(response) showMessage({message: response.message, type: 'success'})
  }

  const fetchProfile = async () => {
    setRefreshing(true)
    const response = await runAxiosAsync<{profile: ProfileRes}>(authClient.get('/auth/profile'))
    setRefreshing(false)
    if(response) dispatch(updateAuthState({profile: {...authState.profile!, ...response.profile}, pending: false}))
  }

  const handleProfileImageSelection = async () => {
     const [image] = await selectImages({allowsMultipleSelection: false, allowsEditing: true, aspect:[1,1]})
     if(image) {
      const formData = new FormData()
      formData.append('avatar', {name: "Avatar", uri: image, type: mime.getType(image) } as any)
      setUpdatingAvatar(true)
      const response = await runAxiosAsync<ProfileRes>(authClient.patch('/auth/update-avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }));
    
      setUpdatingAvatar(false)
      if(response) dispatch(updateAuthState({profile: {...authState.profile!, ...response.profile}, pending: false}));
     }
  }

  return (
   <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchProfile} />}>
    { !authState.profile?.verified && 
    <View style={styles.verificationLinkContainer}>
      <Text style={styles.verificationTitle}>It look like your profile is not verified</Text>
      { busy ? <Text style={styles.verificationLink}>Lütfen bekleyin...</Text> : 
      <Text style={styles.verificationLink} onPress={getVerificationLink}>Tap here to get the link.</Text> }
    </View> }

    {/* Profile image and profile info */}

    <View style={styles.profileContainer}>

    <AvatarView size={80} uri={authState.profile?.avatar} onPress={handleProfileImageSelection}/>

  <View style={styles.profileInfo}>
    <View style={styles.nameContainer}>
      <TextInput value={userName} onChangeText={(text) => setUserName(text)} style={styles.name} />
       { isNameChanged && <Pressable onPress={updateProfile}><AntDesign name='check' size={24} color={colors.primary}/></Pressable> }
    </View>

      <Text style={styles.email}>{authState.profile?.email}</Text>
    </View>
    
    </View>

    <FormDivider/>

    {/* Options for profile */}
    <ProfileOptionListItem antIconName='message1' title='Messages' style={styles.marginBottom} onPress={onMessagePress} active={totalUnreadMessages > 0} />
    <ProfileOptionListItem antIconName='appstore-o' title='Your Listings' style={styles.marginBottom} onPress={onListingPress} active/>
    <ProfileOptionListItem antIconName='logout' title='Log out' style={styles.marginBottom} onPress={signOut} />

   <LoadingSpinner visible={updatingAvatar}/>

   </ScrollView>


  );
};


const styles = StyleSheet.create({
verificationLinkContainer: {
  paddingVertical: 10,
  backgroundColor: colors.deActive,
  marginVertical: 10,
  borderRadius: 5,
},
verificationTitle: {
  fontWeight: '600',
  color: colors.primary,
  textAlign: 'center'
},
verificationLink: {
  fontWeight: '600',
  color: colors.active,
  textAlign: 'center',
  paddingTop: 5
},
container: { 
  padding: 15,
 },
 profileContainer: {
  flexDirection: 'row',
  alignItems: 'center',
 },
 profileInfo: {
  flex: 1,
  paddingLeft: 15,
 },
 name: {
  color: colors.primary,
  fontSize: 20,
  fontWeight: 'bold',
 },
 email: {
  color: colors.primary,
  paddingTop: 2,
 },
 marginBottom:{
  marginBottom: 15
 },
 nameContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
 }
});

export default Profile;