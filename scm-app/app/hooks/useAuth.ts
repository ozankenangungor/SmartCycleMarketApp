import AsyncStorage from "@react-native-async-storage/async-storage";
import asyncStorage, { Keys } from "@utils/asyncStorage";
import client from "app/api/client";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import auth, { getAuthState, updateAuthState } from "app/store/auth";
import { useDispatch, useSelector } from "react-redux";
import useClient from "./useClient";

export interface SignInResponse {
  profile: {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    avatar?: string;
  };
  tokens: {
    refresh: string;
    access: string;
  };
}

type UserInfo = {
  email: string;
  password: string;
};

const useAuth = () => {
  const authState = useSelector(getAuthState);
  const dispatch = useDispatch();
  const { authClient } = useClient();

  const signIn = async (userInfo: UserInfo) => {
    dispatch(updateAuthState({ profile: null, pending: true }));

    const res = await runAxiosAsync<SignInResponse>(client.post("/auth/sign-in", userInfo));

    if (res) {
      // store the tokens
      await asyncStorage.save(Keys.AUTH_TOKEN, res.tokens.access);
      await asyncStorage.save(Keys.REFRESH_TOKEN, res.tokens.refresh);
      //await AsyncStorage.setItem("access-token",res.tokens.access)
      //await AsyncStorage.setItem("refresh-token",res.tokens.refresh)
      dispatch(updateAuthState({profile: { ...res.profile, accessToken: res.tokens.access }, pending: false,}));
    } else {
      dispatch(updateAuthState({ profile: null, pending: false }));
    }
  };

  const signOut = async () => {
    const token = await asyncStorage.get(Keys.REFRESH_TOKEN);
    if (token) {
      dispatch(updateAuthState({ profile: authState.profile, pending: true }));
      const res = await runAxiosAsync(authClient.post("/auth/sign-out", { refreshToken: token }));
      await asyncStorage.remove(Keys.REFRESH_TOKEN);
      await asyncStorage.remove(Keys.AUTH_TOKEN);
      dispatch(updateAuthState({ profile: null, pending: false }));
    }
  };

  const loggedIn = authState.profile ? true : false;

  return { signIn, authState, loggedIn, signOut };
};

export default useAuth;
