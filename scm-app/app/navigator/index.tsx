import {FC, useEffect} from 'react';
import { StyleSheet } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '@utils/colors';
import AuthNavigator from './AuthNavigator';
import { useDispatch,  } from 'react-redux';
import { Profile, updateAuthState } from 'app/store/auth';
import client from 'app/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import LoadingSpinner from '@ui/LoadingSpinner';
import useAuth from 'app/hooks/useAuth';
import TabNavigator from './TabNavigator';
import useClient from 'app/hooks/useClient';
import asyncStorage, { Keys } from '@utils/asyncStorage';

const Stack = createNativeStackNavigator();

const MyTheme = { ...DefaultTheme, colors: {...DefaultTheme.colors,background: colors.white}}

interface Props {

 }

export type ProfileRes = {
  profile: {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    avatar?: string;
  }
}


const Navigator: FC<Props> = (props) => {
  const dispatch = useDispatch()
  const {loggedIn, authState} = useAuth()
  const {authClient} = useClient()
  
  const fetchAuthState = async () => {

    const token = await asyncStorage.get(Keys.AUTH_TOKEN);

    if (token) {
      dispatch(updateAuthState({ pending: true, profile: null }));
      const res = await runAxiosAsync<ProfileRes>(authClient.get("/auth/profile", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
      );

      if (res) {
        dispatch(updateAuthState({ pending: false, profile: {...res.profile, accessToken: token} }));
      } else {
        dispatch(updateAuthState({ pending: false, profile: null }));
      }
    }
  };

  useEffect(() => {
    fetchAuthState()
  }, []);


  return (
  <NavigationContainer theme={MyTheme}>
    <LoadingSpinner visible={authState.pending}   />
        {!loggedIn ? <AuthNavigator/> : <TabNavigator/>}
  </NavigationContainer>

  );
};


const styles = StyleSheet.create({
container: { 

 }

});

export default Navigator;