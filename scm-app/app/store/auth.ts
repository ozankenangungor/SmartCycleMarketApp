import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";


export type Profile = {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    avatar?: string ;
    accessToken: string;
}
interface AuthState {
    profile: null | Profile;
    pending: boolean;
    
}
const initialState: AuthState = {
    profile: null,
    pending: false,
    
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateAuthState(authState, {payload}: PayloadAction<AuthState>) {
            authState.pending = payload.pending
            authState.profile = payload.profile
        } 
    }
})
export const {updateAuthState} = authSlice.actions
export const getAuthState = createSelector(
    (state: RootState) => state,
    (state) => state.auth
  );
export default authSlice.reducer
